const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());

// Database Connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Ollama Configuration
const OLLAMA_URL = process.env.OLLAMA_BASE_URL || 'http://ollama:11434';
const MODEL = 'llama3'; // Ensure you pull this model in the container

// --- Routes ---

// 1. Health Check
app.get('/health', (req, res) => res.json({ status: 'ok', db: pool.totalCount > 0 }));

// 2. Login (Simplified for demo - no real password hashing)
app.post('/api/login', async (req, res) => {
  const { username } = req.body;
  try {
    const result = await pool.query(
      'SELECT * FROM users WHERE username = $1',
      [username]
    );
    if (result.rows.length > 0) {
      const user = result.rows[0];
      res.json({ 
        token: 'mock-jwt-' + Date.now(), 
        user: { id: user.id, name: user.name, role: user.role } 
      });
    } else {
      res.status(401).json({ error: 'User not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Chat with Ollama
app.post('/api/chat', async (req, res) => {
  const { message, userId } = req.body;
  
  // Save User Message
  await pool.query(
    'INSERT INTO messages (user_id, role, content) VALUES ($1, $2, $3)',
    [userId, 'user', message]
  );

  try {
    // Call Ollama
    const ollamaResponse = await fetch(`${OLLAMA_URL}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: MODEL,
        prompt: `You are a helpful DVA assistant. Answer the following question concisely: ${message}`,
        stream: false
      }),
    });
    
    const data = await ollamaResponse.json();
    const aiResponse = data.response;

    // Save AI Message
    await pool.query(
      'INSERT INTO messages (user_id, role, content) VALUES ($1, $2, $3)',
      [userId, 'assistant', aiResponse]
    );

    // Mock Sources for now (Real RAG requires embedding generation)
    const sources = [
      { id: '1', title: 'DVA Policy Manual', url: '#', snippet: 'Relevant section found regarding query.' }
    ];

    res.json({
      role: 'assistant',
      content: aiResponse,
      sources: sources,
      trustLevel: 95
    });

  } catch (err) {
    console.error('Ollama Error:', err);
    res.status(500).json({ error: 'Failed to generate response' });
  }
});

// 4. Admin: Get Queries
app.get('/api/admin/queries', async (req, res) => {
  try {
    // In a real app, join with users table. Here we just get recent messages
    const result = await pool.query(
      'SELECT * FROM messages ORDER BY timestamp DESC LIMIT 20'
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`API running on port ${PORT}`));