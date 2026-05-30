import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { chatWithAgent } from './agent.js';
import { getDb, closeDb } from './tools/db.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '1mb' }));

// Health check
app.get('/api/health', async (_req, res) => {
  try {
    await getDb();
    res.json({ status: 'ok', db: 'connected', model: 'gemini-2.5-flash' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// Main chat endpoint
app.post('/api/chat', async (req, res) => {
  const { message, history } = req.body;

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'message is required' });
  }

  try {
    const reply = await chatWithAgent(message.trim(), history || []);
    res.json({ reply });
  } catch (err) {
    console.error('[Chat Error]', err);
    res.status(500).json({ error: 'Agent error: ' + err.message });
  }
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  await closeDb();
  process.exit(0);
});

app.listen(PORT, () => {
  console.log(`\n⚽ World Cup Agent server running on http://localhost:${PORT}`);
  console.log(`   Health check: http://localhost:${PORT}/api/health\n`);
});
