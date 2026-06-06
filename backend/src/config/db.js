import pg from "pg";
import { env } from "./env.js";

const { Pool } = pg;

if (!env.databaseUrl && !env.pgPassword) {
  throw new Error("DATABASE_URL or PGPASSWORD is required. Create backend/.env from .env.example.");
}

export const pool = new Pool({
  ...(env.databaseUrl
    ? { connectionString: env.databaseUrl }
    : {
        host: env.pgHost,
        port: env.pgPort,
        database: env.pgDatabase,
        user: env.pgUser,
        password: env.pgPassword,
      }),
});

export async function query(sql, params = []) {
  const result = await pool.query(sql, params);
  return result;
}

export async function withTransaction(callback) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    const result = await callback(client);
    await client.query("COMMIT");
    return result;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}
