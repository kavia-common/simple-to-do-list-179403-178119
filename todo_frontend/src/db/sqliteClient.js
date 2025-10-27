import { getDbBytes, setDbBytes } from '../utils/storage';

/**
 * This file abstracts the sql.js database and persistence to IndexedDB.
 * We lazy-load sql.js and keep a singleton Database instance.
 */

let SQL = null;
let db = null;

// Inline schema so CRA doesn’t need special loaders
const DDL = `
CREATE TABLE IF NOT EXISTS tasks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  completed INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER
);
CREATE INDEX IF NOT EXISTS idx_tasks_completed ON tasks(completed);
`;

/**
 * Load sql.js and initialize the singleton Database.
 * - Attempts to restore from IndexedDB.
 * - If none present, creates new DB and applies schema.
 */
async function ensureDB() {
  if (db) return db;

  // Dynamically import sql.js and initialize with wasm locateFile in /public
  if (!SQL) {
    // Load sql.js from a browser-friendly source to avoid bundling 'fs'
    // We dynamically inject the script tag once and reuse window.initSqlJs
    if (!window.initSqlJs) {
      await new Promise((resolve, reject) => {
        const s = document.createElement('script');
        s.src = 'https://cdn.jsdelivr.net/npm/sql.js@1.11.0/dist/sql-wasm.js';
        s.async = true;
        s.onload = resolve;
        s.onerror = () => reject(new Error('Failed to load sql.js'));
        document.head.appendChild(s);
      });
    }
    const initSqlJs = window.initSqlJs;
    SQL = await initSqlJs({
      locateFile: () => `${process.env.PUBLIC_URL || ''}/sql-wasm.wasm`,
    });
  }

  // Load prior bytes if any
  const bytes = await getDbBytes();
  if (bytes && bytes.byteLength > 0) {
    db = new SQL.Database(bytes);
    return db;
  }

  // Create new db and apply schema
  db = new SQL.Database();
  db.run(DDL);
  await persist();
  return db;
}

/**
 * Persist the current database to IndexedDB.
 */
async function persist() {
  if (!db) return;
  const data = db.export(); // Uint8Array
  await setDbBytes(data);
}

// PUBLIC_INTERFACE
export async function initDB() {
  /** Initialize the Database and ensure schema and persistence. */
  await ensureDB();
}

// PUBLIC_INTERFACE
export async function listTasks() {
  /**
   * Return tasks ordered by created_at desc (nulls last).
   * @returns {Promise<Array<{id:number,title:string,completed:0|1,created_at:number}>>}
   */
  const d = await ensureDB();
  const res = d.exec('SELECT id, title, completed, created_at FROM tasks ORDER BY COALESCE(created_at, 0) DESC, id DESC');
  if (!res || res.length === 0) return [];
  const { columns, values } = res[0];
  const out = values.map(row => Object.fromEntries(row.map((v, i) => [columns[i], v])));
  return out;
}

// PUBLIC_INTERFACE
export async function addTask(title) {
  /**
   * Insert a new task and return the inserted row.
   */
  const d = await ensureDB();
  const createdAt = Date.now();
  const stmt = d.prepare('INSERT INTO tasks (title, completed, created_at) VALUES (?, 0, ?)');
  stmt.bind([title, createdAt]);
  stmt.step();
  stmt.free();
  // Get last inserted id
  const idRes = d.exec('SELECT last_insert_rowid() as id');
  const id = idRes?.[0]?.values?.[0]?.[0];
  await persist();
  return { id, title, completed: 0, created_at: createdAt };
}

// PUBLIC_INTERFACE
export async function updateTask(id, title) {
  /**
   * Update title by id.
   */
  const d = await ensureDB();
  const stmt = d.prepare('UPDATE tasks SET title = ? WHERE id = ?');
  stmt.bind([title, id]);
  stmt.step();
  stmt.free();
  await persist();
}

// PUBLIC_INTERFACE
export async function toggleComplete(id, completed) {
  /**
   * Toggle completion state: 0 or 1
   */
  const d = await ensureDB();
  const stmt = d.prepare('UPDATE tasks SET completed = ? WHERE id = ?');
  stmt.bind([completed ? 1 : 0, id]);
  stmt.step();
  stmt.free();
  await persist();
}

// PUBLIC_INTERFACE
export async function deleteTask(id) {
  /**
   * Delete a task by id.
   */
  const d = await ensureDB();
  const stmt = d.prepare('DELETE FROM tasks WHERE id = ?');
  stmt.bind([id]);
  stmt.step();
  stmt.free();
  await persist();
}
