import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import initSqlJs from 'sql.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbFile = path.join(__dirname, '..', 'insurai.db');

if (!fs.existsSync(dbFile)) {
  console.error('Database file not found:', dbFile);
  process.exit(1);
}

const SQL = await initSqlJs({
  locateFile: (file) => path.join(__dirname, '..', 'node_modules', 'sql.js', 'dist', file)
});

const db = new SQL.Database(fs.readFileSync(dbFile));

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

const tables = ['users', 'policies', 'claims', 'documents'];

for (const table of tables) {
  console.log(`\n=== ${table.toUpperCase()} ===`);
  try {
    const rows = all(`SELECT * FROM ${table}`);
    if (!rows.length) {
      console.log('(empty)');
    } else {
      console.table(rows);
    }
  } catch (err) {
    console.error(`Failed to read ${table}:`, err.message);
  }
}
