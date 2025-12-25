import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'consultation_app',
  port: Number(process.env.DB_PORT || 3306),
  waitForConnections: true,
  connectionLimit: 5,
  queueLimit: 0
};

let pool;
let dbAvailable = false;
let connectionChecked = false;

async function initPool() {
  if (pool) {
    return pool;
  }

  pool = mysql.createPool(dbConfig);

  try {
    const connection = await pool.getConnection();
    await connection.ping();
    connection.release();
    dbAvailable = true;
  } catch (error) {
    dbAvailable = false;
    console.warn('Database unavailable, falling back to in-memory store.', error.message);
  } finally {
    connectionChecked = true;
  }

  return pool;
}

export async function getPool() {
  await initPool();
  return pool;
}

export async function isDbAvailable() {
  if (!connectionChecked) {
    await initPool();
  }
  return dbAvailable;
}

export function markDbUnavailable() {
  dbAvailable = false;
}

export async function queryDb(query, params = []) {
  try {
    const activePool = await getPool();
    if (!await isDbAvailable()) {
      return null;
    }
    const [rows] = await activePool.query(query, params);
    return rows;
  } catch (error) {
    markDbUnavailable();
    console.warn('Database query failed, falling back to in-memory store.', error.message);
    return null;
  }
}
