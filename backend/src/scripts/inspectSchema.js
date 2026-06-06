import { pool } from "../config/db.js";

const tables = [
  "activity_logs",
  "approvals",
  "invoice_items",
  "invoices",
  "notifications",
  "purchase_order_items",
  "purchase_orders",
  "quotation_items",
  "quotations",
  "rfq_items",
  "rfqs",
  "users",
  "vendor_rfqs",
  "vendors",
];

const { rows } = await pool.query(
  `select table_name, column_name, data_type
   from information_schema.columns
   where table_schema = 'public'
     and table_name = any($1)
   order by table_name, ordinal_position`,
  [tables]
);

for (const row of rows) {
  console.log(`${row.table_name}.${row.column_name} (${row.data_type})`);
}

await pool.end();
