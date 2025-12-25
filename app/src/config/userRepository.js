import { getPool, isDbAvailable, markDbUnavailable } from './db.js';
import { createPasswordHash } from '../utils/utils.js';
import { addMemoryUser, getMemoryUserById, getMemoryUserByUsername } from './userStore.js';

export async function findUserByUsername(username) {
  if (await isDbAvailable()) {
    try {
      const pool = await getPool();
      const [rows] = await pool.query(
        'SELECT id, username, password_hash, password_salt FROM users WHERE username = ? LIMIT 1',
        [username]
      );
      return rows?.[0] || null;
    } catch (error) {
      markDbUnavailable();
    }
  }

  return getMemoryUserByUsername(username);
}

export async function findUserById(id) {
  if (await isDbAvailable()) {
    try {
      const pool = await getPool();
      const [rows] = await pool.query(
        'SELECT id, username, password_hash, password_salt FROM users WHERE id = ? LIMIT 1',
        [id]
      );
      return rows?.[0] || null;
    } catch (error) {
      markDbUnavailable();
    }
  }

  return getMemoryUserById(id);
}

export async function createUser(username, password) {
  if (await isDbAvailable()) {
    try {
      const pool = await getPool();
      const { hash, salt } = createPasswordHash(password);
      await pool.query(
        'INSERT INTO users (username, password_hash, password_salt) VALUES (?, ?, ?)',
        [username, hash, salt]
      );
      const [rows] = await pool.query(
        'SELECT id, username, password_hash, password_salt FROM users WHERE username = ? LIMIT 1',
        [username]
      );
      return rows?.[0] || { username, password_hash: hash, password_salt: salt };
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        const duplicateError = new Error('USERNAME_EXISTS');
        duplicateError.code = 'USERNAME_EXISTS';
        throw duplicateError;
      }
      markDbUnavailable();
    }
  }

  return addMemoryUser(username, password);
}
