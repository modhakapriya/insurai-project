import express from 'express';
import { nanoid } from 'nanoid';
import { getDb } from '../db.js';

const router = express.Router();

router.get('/', (req, res) => {
  const db = getDb();
  const rows = db.all('SELECT * FROM claims ORDER BY created_at DESC');
  const claims = rows.map((row) => ({
    id: row.id,
    claimant: row.claimant,
    type: row.type,
    amount: row.amount,
    status: row.status,
    aiConfidence: row.ai_confidence,
    submitted: row.submitted,
    processing: row.processing
  }));
  return res.json(claims);
});

router.post('/', (req, res) => {
  const { claimant, type, amount, status, aiConfidence, submitted, processing } = req.body || {};
  if (!claimant || !type) {
    return res.status(400).json({ error: 'claimant and type are required' });
  }

  const db = getDb();
  const claim = {
    id: `CL-${new Date().getFullYear()}-${nanoid(4).toUpperCase()}`,
    claimant,
    type,
    amount: amount || '--',
    status: status || 'Pending',
    aiConfidence: aiConfidence || '--',
    submitted: submitted || new Date().toISOString().slice(0, 10),
    processing: processing || 'Under review'
  };

  db.run(
    `INSERT INTO claims (id, claimant, type, amount, status, ai_confidence, submitted, processing, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      claim.id,
      claim.claimant,
      claim.type,
      claim.amount,
      claim.status,
      claim.aiConfidence,
      claim.submitted,
      claim.processing,
      new Date().toISOString()
    ]
  );

  return res.status(201).json(claim);
});

router.put('/:id', (req, res) => {
  const db = getDb();
  const claim = db.get('SELECT * FROM claims WHERE id = ?', [req.params.id]);
  if (!claim) return res.status(404).json({ error: 'Not found' });

  const updates = {};
  const allowed = ['claimant', 'type', 'amount', 'status', 'aiConfidence', 'submitted', 'processing'];
  allowed.forEach((key) => {
    if (req.body && Object.prototype.hasOwnProperty.call(req.body, key)) {
      updates[key] = req.body[key];
    }
  });

  if (Object.keys(updates).length === 0) {
    return res.json({
      id: claim.id,
      claimant: claim.claimant,
      type: claim.type,
      amount: claim.amount,
      status: claim.status,
      aiConfidence: claim.ai_confidence,
      submitted: claim.submitted,
      processing: claim.processing
    });
  }

  const merged = {
    claimant: updates.claimant ?? claim.claimant,
    type: updates.type ?? claim.type,
    amount: updates.amount ?? claim.amount,
    status: updates.status ?? claim.status,
    aiConfidence: updates.aiConfidence ?? claim.ai_confidence,
    submitted: updates.submitted ?? claim.submitted,
    processing: updates.processing ?? claim.processing
  };

  db.run(
    `UPDATE claims SET claimant = ?, type = ?, amount = ?, status = ?, ai_confidence = ?, submitted = ?, processing = ?
     WHERE id = ?`,
    [
      merged.claimant,
      merged.type,
      merged.amount,
      merged.status,
      merged.aiConfidence,
      merged.submitted,
      merged.processing,
      req.params.id
    ]
  );

  const updated = db.get('SELECT * FROM claims WHERE id = ?', [req.params.id]);
  return res.json({
    id: updated.id,
    claimant: updated.claimant,
    type: updated.type,
    amount: updated.amount,
    status: updated.status,
    aiConfidence: updated.ai_confidence,
    submitted: updated.submitted,
    processing: updated.processing
  });
});

router.delete('/:id', (req, res) => {
  const db = getDb();
  const claim = db.get('SELECT * FROM claims WHERE id = ?', [req.params.id]);
  if (!claim) return res.status(404).json({ error: 'Not found' });
  db.run('DELETE FROM claims WHERE id = ?', [req.params.id]);
  return res.json({
    id: claim.id,
    claimant: claim.claimant,
    type: claim.type,
    amount: claim.amount,
    status: claim.status,
    aiConfidence: claim.ai_confidence,
    submitted: claim.submitted,
    processing: claim.processing
  });
});

export default router;
