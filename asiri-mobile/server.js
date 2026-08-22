const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(cors());
app.use(express.json());

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// In-memory posts fallback if Supabase posts table isn't created yet
let posts = [
  {
    id: '1',
    author: 'Aṣịrị Team',
    handle: '@asiri_app',
    content: 'Welcome to Aṣịrị! Post your first update below.',
    time: '1h',
    likes: 5,
    reposts: 2,
    replies: 1
  }
];

// Register
app.post('/api/auth/register', async (req, res) => {
  const { email, password, display_name, displayName } = req.body;
  const name = display_name || displayName || email.split('@')[0];

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { display_name: name } }
    });

    if (error) return res.status(400).json({ success: false, error: error.message });
    return res.status(200).json({ success: true, user: data.user });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) return res.status(400).json({ success: false, error: error.message });
    return res.status(200).json({ 
      success: true, 
      user: data.user, 
      token: data.session?.access_token || null 
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// Get Posts Feed
app.get('/api/posts', (req, res) => {
  res.status(200).json({ success: true, posts });
});

// Create Post
app.post('/api/posts', (req, res) => {
  const { author, handle, content } = req.body;
  if (!content) return res.status(400).json({ success: false, error: 'Content is required' });

  const newPost = {
    id: Date.now().toString(),
    author: author || 'Anonymous',
    handle: handle || '@user',
    content,
    time: 'Just now',
    likes: 0,
    reposts: 0,
    replies: 0
  };

  posts.unshift(newPost);
  res.status(201).json({ success: true, post: newPost });
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
