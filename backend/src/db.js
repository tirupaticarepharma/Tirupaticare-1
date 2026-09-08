import mysql from "mysql2/promise";
import { config } from "./config.js";

/**
 * One shared connection pool for the whole API.
 * `mysql2/promise` gives us async/await and parameterised queries, which is
 * what keeps this code free of SQL injection - never interpolate values into
 * a query string, always pass them as the second argument.
 */
export const pool = mysql.createPool({
  host: config.db.host,
  port: config.db.port,
  user: config.db.user,
  password: config.db.password,
  database: config.db.name,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: "utf8mb4",
  // Return DECIMAL as a JS number rather than a string.
  decimalNumbers: true,
});

/** Small helper so routes read as `const rows = await query(sql, params)`. */
export async function query(sql, params = []) {
  const [rows] = await pool.execute(sql, params);
  return rows;
}

/** Used by the health check and by migrate/seed to fail fast with a clear message. */
export async function assertConnection() {
  const connection = await pool.getConnection();
  try {
    await connection.ping();
  } finally {
    connection.release();
  }
}
