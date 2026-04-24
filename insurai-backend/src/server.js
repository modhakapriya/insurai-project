import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initDb } from './db.js';
import { authRequired } from './middleware/auth.js';

import authRoutes from './routes/auth.js';
import policiesRoutes from './routes/policies.js';
import claimsRoutes from './routes/claims.js';
import documentsRoutes from './routes/documents.js';
import analyticsRoutes from './routes/analytics.js';
import riskRoutes from './routes/risk.js';
import fraudRoutes from './routes/fraud.js';
import assistantRoutes from './routes/assistant.js';
import aiRoutes from './routes/ai.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ ok: true });
});

app.use('/api/auth', authRoutes);

// Protected routes
app.use('/api', authRequired);
app.use('/api/policies', policiesRoutes);
app.use('/api/claims', claimsRoutes);
app.use('/api/documents', documentsRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/risk', riskRoutes);
app.use('/api/fraud', fraudRoutes);
app.use('/api/assistant', assistantRoutes);
app.use('/api/ai', aiRoutes);

const port = process.env.PORT || 5000;

initDb()
  .then(() => {
    app.listen(port, () => {
      console.log(`InsurAI backend running on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error('Failed to initialize database:', err);
    process.exit(1);
  });
