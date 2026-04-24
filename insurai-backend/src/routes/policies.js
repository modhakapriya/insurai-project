import express from 'express';
import { nanoid } from 'nanoid';
import { getDb } from '../db.js';

const router = express.Router();

router.get('/', (req, res) => {
  const db = getDb();
  const rows = db.all('SELECT * FROM policies ORDER BY created_at DESC');
  const policies = rows.map((row) => ({
    id: row.id,
    holder: row.holder,
    type: row.type,
    premium: row.premium,
    coverage: row.coverage,
    status: row.status,
    riskScore: row.risk_score,
    aiRecommendation: row.ai_recommendation
  }));
  return res.json(policies);
});

router.post('/', async (req, res) => {
  const { holder, type, premium, coverage, status, riskScore, aiRecommendation } = req.body || {};
  if (!holder || !type) {
    return res.status(400).json({ error: 'holder and type are required' });
  }
  const db = getDb();
  const policy = {
    id: `POL-${new Date().getFullYear()}-${nanoid(4).toUpperCase()}`,
    holder,
    type,
    premium: premium || '--',
    coverage: coverage || '--',
    status: status || 'Active',
    riskScore: riskScore || '--',
    aiRecommendation: aiRecommendation || '--'
  };
  db.run(
    `INSERT INTO policies (id, holder, type, premium, coverage, status, risk_score, ai_recommendation, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      policy.id,
      policy.holder,
      policy.type,
      policy.premium,
      policy.coverage,
      policy.status,
      policy.riskScore,
      policy.aiRecommendation,
      new Date().toISOString()
    ]
  );
  return res.status(201).json(policy);
});

router.put('/:id', async (req, res) => {
  const db = getDb();
  const policy = db.get('SELECT * FROM policies WHERE id = ?', [req.params.id]);
  if (!policy) return res.status(404).json({ error: 'Not found' });

  const updates = {};
  const allowed = ['holder', 'type', 'premium', 'coverage', 'status', 'riskScore', 'aiRecommendation'];
  allowed.forEach((key) => {
    if (req.body && Object.prototype.hasOwnProperty.call(req.body, key)) {
      updates[key] = req.body[key];
    }
  });

  if (Object.keys(updates).length === 0) {
    return res.json({
      id: policy.id,
      holder: policy.holder,
      type: policy.type,
      premium: policy.premium,
      coverage: policy.coverage,
      status: policy.status,
      riskScore: policy.risk_score,
      aiRecommendation: policy.ai_recommendation
    });
  }

  const merged = {
    holder: updates.holder ?? policy.holder,
    type: updates.type ?? policy.type,
    premium: updates.premium ?? policy.premium,
    coverage: updates.coverage ?? policy.coverage,
    status: updates.status ?? policy.status,
    riskScore: updates.riskScore ?? policy.risk_score,
    aiRecommendation: updates.aiRecommendation ?? policy.ai_recommendation
  };

  db.run(
    `UPDATE policies SET holder = ?, type = ?, premium = ?, coverage = ?, status = ?, risk_score = ?, ai_recommendation = ?
     WHERE id = ?`,
    [
      merged.holder,
      merged.type,
      merged.premium,
      merged.coverage,
      merged.status,
      merged.riskScore,
      merged.aiRecommendation,
      req.params.id
    ]
  );

  const updated = db.get('SELECT * FROM policies WHERE id = ?', [req.params.id]);
  return res.json({
    id: updated.id,
    holder: updated.holder,
    type: updated.type,
    premium: updated.premium,
    coverage: updated.coverage,
    status: updated.status,
    riskScore: updated.risk_score,
    aiRecommendation: updated.ai_recommendation
  });
});

router.delete('/:id', async (req, res) => {
  const db = getDb();
  const policy = db.get('SELECT * FROM policies WHERE id = ?', [req.params.id]);
  if (!policy) return res.status(404).json({ error: 'Not found' });
  db.run('DELETE FROM policies WHERE id = ?', [req.params.id]);
  return res.json({
    id: policy.id,
    holder: policy.holder,
    type: policy.type,
    premium: policy.premium,
    coverage: policy.coverage,
    status: policy.status,
    riskScore: policy.risk_score,
    aiRecommendation: policy.ai_recommendation
  });
});

export default router;
