import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import initSqlJs from 'sql.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbFile = path.join(__dirname, '..', 'insurai.db');
const seedFile = path.join(__dirname, '..', 'data.json');

let db;

function resolveWasm(file) {
  return path.join(__dirname, '..', 'node_modules', 'sql.js', 'dist', file);
}

function saveDb() {
  const data = db.export();
  fs.writeFileSync(dbFile, Buffer.from(data));
}

function all(sql, params = []) {
  const stmt = db.prepare(sql);
  stmt.bind(params);
  const rows = [];
  while (stmt.step()) {
    rows.push(stmt.getAsObject());
  }
  stmt.free();
  return rows;
}

function get(sql, params = []) {
  const rows = all(sql, params);
  return rows[0];
}

function run(sql, params = []) {
  const stmt = db.prepare(sql);
  stmt.run(params);
  stmt.free();
  saveDb();
}

export async function initDb() {
  const SQL = await initSqlJs({ locateFile: resolveWasm });
  if (fs.existsSync(dbFile)) {
    const fileBuffer = fs.readFileSync(dbFile);
    db = new SQL.Database(fileBuffer);
  } else {
    db = new SQL.Database();
  }

  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS policies (
      id TEXT PRIMARY KEY,
      holder TEXT NOT NULL,
      type TEXT NOT NULL,
      premium TEXT NOT NULL,
      coverage TEXT NOT NULL,
      status TEXT NOT NULL,
      risk_score TEXT NOT NULL,
      ai_recommendation TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS claims (
      id TEXT PRIMARY KEY,
      claimant TEXT NOT NULL,
      type TEXT NOT NULL,
      amount TEXT NOT NULL,
      status TEXT NOT NULL,
      ai_confidence TEXT NOT NULL,
      submitted TEXT NOT NULL,
      processing TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS documents (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      size TEXT NOT NULL,
      timestamp TEXT NOT NULL,
      status TEXT NOT NULL,
      confidence TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
  `);

  const userCount = get('SELECT COUNT(1) as count FROM users')?.count || 0;
  if (userCount === 0 && fs.existsSync(seedFile)) {
    const seed = JSON.parse(fs.readFileSync(seedFile, 'utf-8'));
    const now = new Date().toISOString();

    (seed.users || []).forEach((u) => {
      run(
        'INSERT INTO users (id, email, password_hash, created_at) VALUES (?, ?, ?, ?)',
        [u.id, u.email, u.passwordHash, now]
      );
    });
    (seed.policies || []).forEach((p) => {
      run(
        `INSERT INTO policies (id, holder, type, premium, coverage, status, risk_score, ai_recommendation, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [p.id, p.holder, p.type, p.premium, p.coverage, p.status, p.riskScore, p.aiRecommendation, now]
      );
    });
    (seed.claims || []).forEach((c) => {
      run(
        `INSERT INTO claims (id, claimant, type, amount, status, ai_confidence, submitted, processing, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [c.id, c.claimant, c.type, c.amount, c.status, c.aiConfidence, c.submitted, c.processing, now]
      );
    });
    (seed.documents || []).forEach((d) => {
      run(
        `INSERT INTO documents (id, name, category, size, timestamp, status, confidence, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [d.id, d.name, d.category, d.size, d.timestamp, d.status, d.confidence, now]
      );
    });
  } else {
    saveDb();
  }
}

export function getDb() {
  return { all, get, run };
}
