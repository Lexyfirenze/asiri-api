const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(cors());
app.use(express.json());

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Register Endpoint
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

// Login Endpoint
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

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

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
