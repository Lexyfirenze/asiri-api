const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Supabase via HTTPS SDK
const supabaseUrl = process.env.SUPABASE_URL || 'https://nrjevwkrhkqzsjoptwda.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const JWT_SECRET = process.env.JWT_SECRET || 'asiri_super_secret_key';

// Middleware: Authenticate Request
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// GET /api/feed - Fetch unified feed with handle privacy checks
app.get('/api/feed', async (req, res) => {
  try {
    const { data: posts, error } = await supabase
      .from('posts')
      .select(`
        id,
        title,
        content,
        used_identity,
        upvote_count,
        downvote_count,
        score,
        comment_count,
        created_at,
        nodes ( name ),
        profiles!posts_author_id_fkey (
          username,
          asiri_handle,
          display_name,
          avatar_url
        )
      `)
      .order('created_at', { ascending: false })
      .limit(30);

    if (error) throw error;

    // Apply identity privacy transformation
    const sanitizedPosts = posts.map(post => {
      const isPublic = post.used_identity === 'public';
      const profile = post.profiles || {};

      return {
        id: post.id,
        title: post.title,
        content: post.content,
        used_identity: post.used_identity,
        upvote_count: post.upvote_count,
        downvote_count: post.downvote_count,
        score: post.score,
        comment_count: post.comment_count,
        created_at: post.created_at,
        node_name: post.nodes ? post.nodes.name : null,
        author_handle: isPublic ? profile.username : profile.asiri_handle,
        author_display_name: isPublic ? profile.display_name : 'Aṣịrị User',
        author_avatar: isPublic ? profile.avatar_url : null
      };
    });

    res.json({ success: true, posts: sanitizedPosts });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/posts - Create new post
app.post('/api/posts', authenticateToken, async (req, res) => {
  const { node_id, used_identity, title, content, media_urls } = req.body;

  if (!['public', 'pseudonymous'].includes(used_identity)) {
    return res.status(400).json({ error: 'Invalid identity mode.' });
  }

  try {
    const { data, error } = await supabase
      .from('posts')
      .insert([
        {
          author_id: req.user.id,
          node_id: node_id || null,
          used_identity,
          title,
          content,
          media_urls: media_urls || []
        }
      ])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({ success: true, post: data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/posts/:id/vote - Upvote or Downvote a post
app.post('/api/posts/:id/vote', authenticateToken, async (req, res) => {
  const postId = req.params.id;
  const { vote_value } = req.body; // 1 for upvote, -1 for downvote

  if (![1, -1].includes(vote_value)) {
    return res.status(400).json({ error: 'Vote value must be 1 or -1' });
  }

  try {
    const { data, error } = await supabase
      .from('post_votes')
      .upsert(
        {
          post_id: postId,
          user_id: req.user.id,
          vote_value
        },
        { onConflict: 'post_id,user_id' }
      );

    if (error) throw error;

    res.json({ success: true, message: 'Vote recorded' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Asiri Backend Service operational on port ${PORT}`));
