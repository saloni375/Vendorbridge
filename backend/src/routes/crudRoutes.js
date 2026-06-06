import { Router } from "express";
import { query } from "../config/db.js";
import { asyncHandler, notFound, pickDefined, sendOk } from "../utils/http.js";

const tableConfig = {
  users: {
    table: "users",
    searchable: ["name", "email", "role"],
    updateable: ["name", "email", "role"],
  },
  vendors: {
    table: "vendors",
    searchable: ["company_name", "email", "category", "gst_number"],
    insertable: ["company_name", "category", "gst_number", "email", "phone", "address", "status", "rating"],
    updateable: ["company_name", "category", "gst_number", "email", "phone", "address", "status", "rating"],
  },
  rfqs: {
    table: "rfqs",
    searchable: ["title", "status"],
    insertable: ["title", "description", "deadline", "status", "budget", "created_by"],
    updateable: ["title", "description", "deadline", "status", "budget"],
  },
  quotations: {
    table: "quotations",
    searchable: ["status", "notes"],
    insertable: ["rfq_id", "vendor_id", "total_amount", "delivery_days", "notes", "status"],
    updateable: ["total_amount", "delivery_days", "notes", "status"],
  },
  approvals: {
    table: "approvals",
    searchable: ["status", "remarks"],
    updateable: ["status", "remarks"],
  },
  "purchase-orders": {
    table: "purchase_orders",
    searchable: ["po_number", "status"],
    insertable: ["quotation_id", "po_number", "status"],
    updateable: ["status"],
  },
  invoices: {
    table: "invoices",
    searchable: ["invoice_number", "status"],
    insertable: ["po_id", "invoice_number", "tax", "total_amount", "status"],
    updateable: ["tax", "total_amount", "status"],
  },
  notifications: {
    table: "notifications",
    searchable: ["message"],
    updateable: ["is_read"],
  },
  "activity-logs": {
    table: "activity_logs",
    searchable: ["entity_type", "action"],
  },
};

const itemTableConfig = {
  rfqs: { table: "rfq_items", foreignKey: "rfq_id" },
  quotations: { table: "quotation_items", foreignKey: "quotation_id" },
  "purchase-orders": { table: "purchase_order_items", foreignKey: "po_id" },
  invoices: { table: "invoice_items", foreignKey: "invoice_id" },
};

const mutationRoles = {
  users: {
    post: ["admin"],
    patch: ["admin"],
  },
  vendors: {
    post: ["admin"],
    patch: ["admin"],
  },
  rfqs: {
    post: ["admin", "procurement_officer"],
    patch: ["admin", "procurement_officer"],
  },
  quotations: {
    post: ["admin", "vendor"],
    patch: ["admin", "vendor"],
  },
  approvals: {
    patch: ["admin", "manager"],
  },
  "purchase-orders": {
    post: ["admin", "procurement_officer"],
    patch: ["admin", "procurement_officer"],
  },
  invoices: {
    post: ["admin", "procurement_officer"],
    patch: ["admin", "procurement_officer"],
  },
};

const readRoles = {
  users: ["admin"],
  vendors: ["admin", "procurement_officer"],
  approvals: ["admin", "manager"],
  invoices: ["admin", "procurement_officer"],
  "activity-logs": ["admin"],
};

function hasResourceRole(req, allowedRoles) {
  return !allowedRoles || allowedRoles.includes(req.user?.role);
}

function canMutate(req, resource, action) {
  return hasResourceRole(req, mutationRoles[resource]?.[action]);
}

function canRead(req, resource) {
  return hasResourceRole(req, readRoles[resource]);
}

function buildSearch(config, search, params) {
  if (!search || !config.searchable?.length) {
    return "";
  }

  params.push(`%${search}%`);
  const placeholder = `$${params.length}`;
  return ` where ${config.searchable.map((column) => `${column}::text ilike ${placeholder}`).join(" or ")}`;
}

function buildFilters(resource, queryParams, params) {
  const filters = [];
  const map = {
    rfqs: { status: "status", createdBy: "created_by" },
    quotations: { rfqId: "rfq_id", vendorId: "vendor_id", status: "status" },
    approvals: { status: "status", quotationId: "quotation_id" },
    "purchase-orders": { quotationId: "quotation_id", status: "status" },
    invoices: { purchaseOrderId: "po_id", status: "status" },
    notifications: { isRead: "is_read", userId: "user_id" },
  }[resource] || {};

  for (const [key, column] of Object.entries(map)) {
    if (queryParams[key] === undefined || queryParams[key] === "") continue;
    params.push(queryParams[key]);
    filters.push(`${column} = $${params.length}`);
  }

  return filters;
}

function buildInsert(config, body) {
  const values = pickDefined(body);
  const columns = (config.insertable || []).filter((column) => column in values);
  const params = columns.map((column) => values[column]);
  const placeholders = columns.map((_, index) => `$${index + 1}`);

  return { columns, params, placeholders };
}

function buildUpdate(config, body) {
  const values = pickDefined(body);
  const columns = (config.updateable || []).filter((column) => column in values);
  const params = columns.map((column) => values[column]);
  const assignments = columns.map((column, index) => `${column} = $${index + 1}`);

  return { columns, params, assignments };
}

export function createCrudRouter(resource) {
  const router = Router();
  const config = tableConfig[resource];

  router.get(
    "/",
    asyncHandler(async (req, res) => {
      if (!canRead(req, resource)) {
        return res.status(403).json({ message: "You do not have permission to view this resource" });
      }

      const params = [];
      const searchWhere = buildSearch(config, req.query.search || req.query.q, params);
      const filters = buildFilters(resource, req.query, params);
      const whereParts = [
        searchWhere ? searchWhere.replace(/^ where /, "") : "",
        ...filters,
      ].filter(Boolean);
      const where = whereParts.length ? ` where ${whereParts.join(" and ")}` : "";
      const limit = Math.min(Number(req.query.limit || 100), 250);
      params.push(limit);
      const listSql =
        resource === "rfqs"
          ? `select r.*, coalesce(q.quote_count, 0)::int as quote_count
             from rfqs r
             left join (
               select rfq_id, count(*) as quote_count
               from quotations
               group by rfq_id
             ) q on q.rfq_id = r.id${where}
             order by r.id desc limit $${params.length}`
          : `select * from ${config.table}${where} order by id desc limit $${params.length}`;

      const { rows } = await query(listSql, params);

      return sendOk(res, rows);
    })
  );

  router.get(
    "/:id",
    asyncHandler(async (req, res) => {
      if (!canRead(req, resource)) {
        return res.status(403).json({ message: "You do not have permission to view this resource" });
      }

      const { rows } = await query(`select * from ${config.table} where id = $1`, [req.params.id]);
      return rows[0] ? sendOk(res, rows[0]) : notFound(res, resource);
    })
  );

  router.post(
    "/",
    asyncHandler(async (req, res) => {
      if (!canMutate(req, resource, "post")) {
        return res.status(403).json({ message: "You do not have permission to create this resource" });
      }

      let body = req.body;
      if (resource === "rfqs") {
        body = { ...req.body, created_by: req.user.id };
      }
      if (resource === "quotations" && req.user.role === "vendor") {
        if (!req.user.vendorId) {
          return res.status(400).json({ message: "Vendor profile is required to submit quotations" });
        }

        body = { ...req.body, vendor_id: req.user.vendorId, status: req.body.status || "Submitted" };
      }
      const { columns, params, placeholders } = buildInsert(config, body);

      if (!columns.length) {
        return res.status(400).json({ message: "No valid fields supplied" });
      }

      const { rows } = await query(
        `insert into ${config.table} (${columns.join(", ")})
         values (${placeholders.join(", ")})
         returning *`,
        params
      );

      return sendOk(res, rows[0], 201);
    })
  );

  router.patch(
    "/:id",
    asyncHandler(async (req, res) => {
      if (!canMutate(req, resource, "patch")) {
        return res.status(403).json({ message: "You do not have permission to update this resource" });
      }

      if (resource === "quotations" && req.user.role === "vendor") {
        const existing = await query("select vendor_id from quotations where id = $1", [req.params.id]);
        if (!existing.rows[0]) {
          return notFound(res, resource);
        }
        if (Number(existing.rows[0].vendor_id) !== Number(req.user.vendorId)) {
          return res.status(403).json({ message: "You can update only your own quotations" });
        }
      }

      const { assignments, params } = buildUpdate(config, req.body);

      if (!assignments.length) {
        return res.status(400).json({ message: "No valid fields supplied" });
      }

      params.push(req.params.id);
      const { rows } = await query(
        `update ${config.table}
         set ${assignments.join(", ")}
         where id = $${params.length}
         returning *`,
        params
      );

      return rows[0] ? sendOk(res, rows[0]) : notFound(res, resource);
    })
  );

  const itemConfig = itemTableConfig[resource];
  if (itemConfig) {
    router.get(
      "/:id/items",
      asyncHandler(async (req, res) => {
        if (!canRead(req, resource)) {
          return res.status(403).json({ message: "You do not have permission to view this resource" });
        }

        const { rows } = await query(`select * from ${itemConfig.table} where ${itemConfig.foreignKey} = $1`, [
          req.params.id,
        ]);
        return sendOk(res, rows);
      })
    );

    router.post(
      "/:id/items",
      asyncHandler(async (req, res) => {
        if (!canMutate(req, resource, "post")) {
          return res.status(403).json({ message: "You do not have permission to create this resource" });
        }

        const body = pickDefined({ ...req.body, [itemConfig.foreignKey]: req.params.id });
        const columns = Object.keys(body);
        const params = Object.values(body);
        const placeholders = columns.map((_, index) => `$${index + 1}`);

        const { rows } = await query(
          `insert into ${itemConfig.table} (${columns.join(", ")})
           values (${placeholders.join(", ")})
           returning *`,
          params
        );

        return sendOk(res, rows[0], 201);
      })
    );
  }

  return router;
}
