import express from 'express';
import { nanoid } from 'nanoid';
import { getDb } from '../db.js';

const router = express.Router();

router.get('/', (req, res) => {
  const db = getDb();
  const rows = db.all('SELECT * FROM documents ORDER BY created_at DESC');
  const documents = rows.map((row) => ({
    id: row.id,
    name: row.name,
    category: row.category,
    size: row.size,
    timestamp: row.timestamp,
    status: row.status,
    confidence: row.confidence
  }));
  return res.json(documents);
});

router.post('/', (req, res) => {
  const { name, category, size, timestamp, status, confidence } = req.body || {};
  if (!name || !category) {
    return res.status(400).json({ error: 'name and category are required' });
  }

  const db = getDb();
  const doc = {
    id: `DOC-${nanoid(5).toUpperCase()}`,
    name,
    category,
    size: size || '--',
    timestamp: timestamp || new Date().toISOString().slice(0, 16).replace('T', ' '),
    status: status || 'Processing',
    confidence: confidence || '--'
  };

  db.run(
    `INSERT INTO documents (id, name, category, size, timestamp, status, confidence, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      doc.id,
      doc.name,
      doc.category,
      doc.size,
      doc.timestamp,
      doc.status,
      doc.confidence,
      new Date().toISOString()
    ]
  );

  return res.status(201).json(doc);
});

router.put('/:id', (req, res) => {
  const db = getDb();
  const doc = db.get('SELECT * FROM documents WHERE id = ?', [req.params.id]);
  if (!doc) return res.status(404).json({ error: 'Not found' });

  const updates = {};
  const allowed = ['name', 'category', 'size', 'timestamp', 'status', 'confidence'];
  allowed.forEach((key) => {
    if (req.body && Object.prototype.hasOwnProperty.call(req.body, key)) {
      updates[key] = req.body[key];
    }
  });

  if (Object.keys(updates).length === 0) {
    return res.json({
      id: doc.id,
      name: doc.name,
      category: doc.category,
      size: doc.size,
      timestamp: doc.timestamp,
      status: doc.status,
      confidence: doc.confidence
    });
  }

  const merged = {
    name: updates.name ?? doc.name,
    category: updates.category ?? doc.category,
    size: updates.size ?? doc.size,
    timestamp: updates.timestamp ?? doc.timestamp,
    status: updates.status ?? doc.status,
    confidence: updates.confidence ?? doc.confidence
  };

  db.run(
    `UPDATE documents SET name = ?, category = ?, size = ?, timestamp = ?, status = ?, confidence = ?
     WHERE id = ?`,
    [
      merged.name,
      merged.category,
      merged.size,
      merged.timestamp,
      merged.status,
      merged.confidence,
      req.params.id
    ]
  );

  const updated = db.get('SELECT * FROM documents WHERE id = ?', [req.params.id]);
  return res.json({
    id: updated.id,
    name: updated.name,
    category: updated.category,
    size: updated.size,
    timestamp: updated.timestamp,
    status: updated.status,
    confidence: updated.confidence
  });
});

router.delete('/:id', (req, res) => {
  const db = getDb();
  const doc = db.get('SELECT * FROM documents WHERE id = ?', [req.params.id]);
  if (!doc) return res.status(404).json({ error: 'Not found' });
  db.run('DELETE FROM documents WHERE id = ?', [req.params.id]);
  return res.json({
    id: doc.id,
    name: doc.name,
    category: doc.category,
    size: doc.size,
    timestamp: doc.timestamp,
    status: doc.status,
    confidence: doc.confidence
  });
});

export default router;
