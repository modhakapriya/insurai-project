import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { nanoid } from 'nanoid';
import { getDb } from '../db.js';

const router = express.Router();

router.post('/register', async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const db = getDb();
  const exists = db.get('SELECT id FROM users WHERE lower(email) = lower(?)', [email]);
  if (exists) {
    return res.status(409).json({ error: 'User already exists' });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = { id: `u_${nanoid(8)}`, email, passwordHash };
  db.run(
    'INSERT INTO users (id, email, password_hash, created_at) VALUES (?, ?, ?, ?)',
    [user.id, user.email, user.passwordHash, new Date().toISOString()]
  );

  const token = jwt.sign({ sub: user.id, email: user.email }, process.env.JWT_SECRET || 'dev', { expiresIn: '7d' });
  return res.json({ token });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const db = getDb();
  const user = db.get(
    'SELECT id, email, password_hash as passwordHash FROM users WHERE lower(email) = lower(?)',
    [email]
  );
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  let ok = false;
  if (user.passwordHash.startsWith('plain:')) {
    ok = user.passwordHash.slice(6) === password;
  } else {
    ok = await bcrypt.compare(password, user.passwordHash);
  }

  if (!ok) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign({ sub: user.id, email: user.email }, process.env.JWT_SECRET || 'dev', { expiresIn: '7d' });
  return res.json({ token });
});

export default router;
