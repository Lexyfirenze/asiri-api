const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

// 1. Initialize express app FIRST
const app = express();

// 2. Configure middleware
app.use(cors());
app.use(express.json());

// 3. Configure database pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

// 4. Declare routes
app.get('/', (req, res) => {
  res.send('Aṣịrị API Service is running!');
});

app.get('/api/feed', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM posts ORDER BY created_at DESC LIMIT 20');
    res.json({ success: true, posts: rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 5. Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

