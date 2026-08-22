const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(cors());
app.use(express.json());

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Auth Endpoints
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

// GET All Posts from Supabase
app.get('/api/posts', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.status(200).json({ success: true, posts: data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// CREATE Post in Supabase
app.post('/api/posts', async (req, res) => {
  const { author, handle, content } = req.body;
  if (!content) return res.status(400).json({ success: false, error: 'Content is required' });

  try {
    const { data, error } = await supabase
      .from('posts')
      .insert([{ author: author || 'Anonymous', handle: handle || '@user', content }])
      .select();

    if (error) throw error;
    res.status(201).json({ success: true, post: data[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// LIKE Post
app.post('/api/posts/:id/like', async (req, res) => {
  const { id } = req.params;
  try {
    const { data: post, error: fetchErr } = await supabase
      .from('posts')
      .select('likes')
      .eq('id', id)
      .single();

    if (fetchErr) throw fetchErr;

    const { data, error } = await supabase
      .from('posts')
      .update({ likes: (post.likes || 0) + 1 })
      .eq('id', id)
      .select();

    if (error) throw error;
    res.status(200).json({ success: true, post: data[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
