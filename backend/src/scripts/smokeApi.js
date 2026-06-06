import { app } from "../app.js";
import { pool } from "../config/db.js";
import { env } from "../config/env.js";
import jwt from "jsonwebtoken";

const server = app.listen(0);
const { port } = server.address();
const token = jwt.sign({ id: 1, email: "smoke@vendorbridge.local", role: "admin" }, env.jwtSecret);

async function get(path) {
  const response = await fetch(`http://localhost:${port}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error(`${path} failed with ${response.status}: ${await response.text()}`);
  }

  return response.json();
}

try {
  await get("/api/health");
  await get("/api/vendors");
  await get("/api/rfqs");
  await get("/api/quotations");
  await get("/api/approvals");
  await get("/api/invoices");
  console.log("API smoke test passed");
} finally {
  server.close();
  await pool.end();
}
