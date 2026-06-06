import { app } from "./app.js";
import { pool } from "./config/db.js";
import { env } from "./config/env.js";

async function start() {
  await pool.query("select 1");

  app.listen(env.port, () => {
    console.log(`VendorBridge API running on http://localhost:${env.port}`);
  });
}

start().catch((error) => {
  console.error("Failed to start VendorBridge API");
  console.error(error);
  process.exit(1);
});
