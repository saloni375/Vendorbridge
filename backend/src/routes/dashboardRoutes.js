import { Router } from "express";
import { query } from "../config/db.js";
import { asyncHandler, sendOk } from "../utils/http.js";

const router = Router();

async function count(sql, params = []) {
  const { rows } = await query(sql, params);
  return Number(rows[0]?.count || 0);
}

router.get(
  "/summary",
  asyncHandler(async (_req, res) => {
    const [
      vendors,
      activeRfqs,
      pendingApprovals,
      openInvoices,
      recentPurchaseOrders,
      recentInvoices,
      notifications,
    ] = await Promise.all([
      count("select count(*) from vendors"),
      count("select count(*) from rfqs where lower(coalesce(status, '')) not in ('closed', 'cancelled')"),
      count("select count(*) from approvals where lower(coalesce(status, '')) = 'pending'"),
      count("select count(*) from invoices where lower(coalesce(status, '')) <> 'paid'"),
      query("select * from purchase_orders order by id desc limit 5").then((r) => r.rows),
      query("select * from invoices order by id desc limit 5").then((r) => r.rows),
      query("select * from notifications order by id desc limit 10").then((r) => r.rows),
    ]);

    return sendOk(res, {
      kpis: { vendors, activeRfqs, pendingApprovals, openInvoices },
      recentPurchaseOrders,
      recentInvoices,
      notifications,
    });
  })
);

export default router;
