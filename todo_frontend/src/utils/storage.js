import { get as idbGet, set as idbSet } from 'idb-keyval';

const DB_KEY = 'todo-db';

/**
 * PUBLIC_INTERFACE
 * getDbBytes
 * Retrieve persisted SQLite database bytes from IndexedDB.
 * @returns {Promise<Uint8Array|null>}
 */
export async function getDbBytes() {
  const data = await idbGet(DB_KEY);
  return data || null;
}

/**
 * PUBLIC_INTERFACE
 * setDbBytes
 * Persist SQLite database bytes to IndexedDB.
 * @param {Uint8Array} bytes
 * @returns {Promise<void>}
 */
export async function setDbBytes(bytes) {
  await idbSet(DB_KEY, bytes);
}
