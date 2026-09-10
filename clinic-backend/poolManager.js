import pool from "./db.js";

export function getPool(schemaName) {
  return pool;
}

export default pool;
