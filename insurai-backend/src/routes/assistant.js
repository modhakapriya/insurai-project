import express from 'express';

const router = express.Router();

router.post('/chat', (req, res) => {
  const { message } = req.body || {};
  if (!message) return res.status(400).json({ error: 'Message is required' });

  const reply = {
    text: `I received: "${message}". This backend is ready for real model integration.`,
    timestamp: new Date().toISOString()
  };
  return res.json(reply);
});

export default router;
