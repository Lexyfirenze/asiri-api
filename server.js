app.get('/', (req, res) => {
  res.send('Aṣịrị API Service is running!');
});
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

// Root health check
app.get('/', (req, res) => {
  res.send('Aṣịrị API Service is running!');
});

// Fetch feed posts
app.get('/api/feed', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM posts ORDER BY created_at DESC LIMIT 20');
    res.json({ success: true, posts: rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

