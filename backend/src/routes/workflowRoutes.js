import { Router } from "express";
import { query, withTransaction } from "../config/db.js";
import { makeInvoiceNumber, makePoNumber } from "../services/documentNumbers.js";
import { createActivityLog, createNotification } from "../services/auditService.js";
import { asyncHandler, sendOk } from "../utils/http.js";
import { requireRole } from "../middleware/auth.js";

const router = Router();

function createPdfBuffer(lines) {
  const text = lines.filter(Boolean).join("\\n");
  const stream = `BT /F1 14 Tf 50 760 Td (${text.replace(/[()\\]/g, "\\$&").replace(/\n/g, ") Tj 0 -22 Td (")}) Tj ET`;
  const objects = [
    "1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj",
    "2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj",
    "3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >> endobj",
    "4 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj",
    `5 0 obj << /Length ${Buffer.byteLength(stream)} >> stream\n${stream}\nendstream endobj`,
  ];
  let pdf = "%PDF-1.4\n";
  const offsets = [0];
  for (const object of objects) {
    offsets.push(Buffer.byteLength(pdf));
    pdf += `${object}\n`;
  }
  const xrefOffset = Buffer.byteLength(pdf);
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (const offset of offsets.slice(1)) {
    pdf += `${String(offset).padStart(10, "0")} 00000 n \n`;
  }
  pdf += `trailer << /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;
  return Buffer.from(pdf);
}

router.post(
  "/rfqs/:id/vendors",
  requireRole("admin", "procurement_officer"),
  asyncHandler(async (req, res) => {
    const { vendorIds = [] } = req.body;

    if (!Array.isArray(vendorIds) || vendorIds.length === 0) {
      return res.status(400).json({ message: "vendorIds must be a non-empty array" });
    }

    const rows = await withTransaction(async (client) => {
      const inserted = [];

      for (const vendorId of vendorIds) {
        const result = await client.query(
          `insert into vendor_rfqs (rfq_id, vendor_id)
           values ($1, $2)
           returning *`,
          [req.params.id, vendorId]
        );

        if (result.rows[0]) inserted.push(result.rows[0]);
      }

      await createActivityLog(client, {
        actorId: req.user?.id,
        module: "RFQ",
        action: `Assigned ${vendorIds.length} vendor(s) to RFQ`,
        referenceId: req.params.id,
      });

      return inserted;
    });

    return sendOk(res, rows, 201);
  })
);

router.post(
  "/quotations/:id/select",
  requireRole("admin", "procurement_officer"),
  asyncHandler(async (req, res) => {
    const approval = await withTransaction(async (client) => {
      const quotationResult = await client.query("select * from quotations where id = $1", [req.params.id]);
      const quotation = quotationResult.rows[0];

      if (!quotation) {
        const error = new Error("Quotation not found");
        error.status = 404;
        throw error;
      }

      await client.query("update quotations set status = 'selected' where id = $1", [req.params.id]);

      const approvalResult = await client.query(
        `insert into approvals (quotation_id, approver_id, status, remarks)
         values ($1, $2, 'Pending', 'Quotation selected for approval')
         returning *`,
        [quotation.id, req.user?.id || null]
      );

      await createActivityLog(client, {
        actorId: req.user?.id,
        module: "Quotation",
        action: "Selected quotation for approval",
        referenceId: quotation.id,
      });

      return approvalResult.rows[0];
    });

    return sendOk(res, approval, 201);
  })
);

router.post(
  "/purchase-orders",
  requireRole("admin", "procurement_officer"),
  asyncHandler(async (req, res) => {
    const { approvalId } = req.body;

    if (!approvalId) {
      return res.status(400).json({ message: "approvalId is required" });
    }

    const result = await withTransaction(async (client) => {
      const approvalResult = await client.query("select * from approvals where id = $1", [approvalId]);
      const approval = approvalResult.rows[0];

      if (!approval) {
        const error = new Error("Approval not found");
        error.status = 404;
        throw error;
      }

      const poResult = await client.query(
        `insert into purchase_orders (quotation_id, po_number, status)
         values ($1, $2, 'Generated')
         returning *`,
        [approval.quotation_id || null, makePoNumber()]
      );

      await createActivityLog(client, {
        actorId: req.user?.id,
        module: "Purchase Order",
        action: "Generated purchase order from approval",
        referenceId: poResult.rows[0].id,
      });

      return poResult.rows[0];
    });

    return sendOk(res, result, 201);
  })
);

router.post(
  "/approvals/:id/approve",
  requireRole("admin", "manager"),
  asyncHandler(async (req, res) => {
    const result = await withTransaction(async (client) => {
      const approvalResult = await client.query("select * from approvals where id = $1", [req.params.id]);
      const approval = approvalResult.rows[0];

      if (!approval) {
        const error = new Error("Approval not found");
        error.status = 404;
        throw error;
      }

      await client.query(
        `update approvals
         set status = 'Approved', remarks = coalesce($2, remarks), approved_at = now()
         where id = $1`,
        [req.params.id, req.body.remarks || null]
      );

      const poResult = await client.query(
        `insert into purchase_orders (quotation_id, po_number, status)
         values ($1, $2, 'Generated')
         returning *`,
        [approval.quotation_id || null, makePoNumber()]
      );

      await createActivityLog(client, {
        actorId: req.user?.id,
        module: "Approval",
        action: "Approved procurement request and generated purchase order",
        referenceId: req.params.id,
      });

      return { approvalId: req.params.id, purchaseOrder: poResult.rows[0] };
    });

    return sendOk(res, result);
  })
);

router.post(
  "/approvals/:id/reject",
  requireRole("admin", "manager"),
  asyncHandler(async (req, res) => {
    const { rows } = await query(
      `update approvals
       set status = 'Rejected', remarks = $2, approved_at = now()
       where id = $1
       returning *`,
      [req.params.id, req.body.remarks || null]
    );

    if (!rows[0]) {
      return res.status(404).json({ message: "Approval not found" });
    }

    return sendOk(res, rows[0]);
  })
);

router.post(
  "/notifications/:id/read",
  asyncHandler(async (req, res) => {
    const { rows } = await query(
      `update notifications
       set is_read = true
       where id = $1
       returning *`,
      [req.params.id]
    );

    if (!rows[0]) {
      return res.status(404).json({ message: "Notification not found" });
    }

    return sendOk(res, rows[0]);
  })
);

router.patch(
  "/notifications/:id/read",
  asyncHandler(async (req, res) => {
    const { rows } = await query(
      `update notifications
       set is_read = true
       where id = $1
       returning *`,
      [req.params.id]
    );

    if (!rows[0]) {
      return res.status(404).json({ message: "Notification not found" });
    }

    return sendOk(res, rows[0]);
  })
);

router.post(
  "/invoices/:id/email",
  requireRole("admin", "procurement_officer"),
  asyncHandler(async (req, res) => {
    await withTransaction(async (client) => {
      await createActivityLog(client, {
        actorId: req.user?.id,
        module: "Invoice",
        action: `Email queued for invoice ${req.params.id}`,
        referenceId: req.params.id,
      });

      await createNotification(client, {
        userId: req.user?.id,
        title: "Invoice email queued",
        message: req.body.to ? `Invoice was queued for ${req.body.to}` : "Invoice email was queued.",
        type: "invoice",
        referenceId: req.params.id,
      });
    });

    return sendOk(res, { message: "Invoice email queued" });
  })
);

router.post(
  "/invoices",
  requireRole("admin", "procurement_officer"),
  asyncHandler(async (req, res) => {
    const { purchaseOrderId } = req.body;

    if (!purchaseOrderId) {
      return res.status(400).json({ message: "purchaseOrderId is required" });
    }

    const invoice = await withTransaction(async (client) => {
      const poResult = await client.query("select * from purchase_orders where id = $1", [purchaseOrderId]);
      const po = poResult.rows[0];

      if (!po) {
        const error = new Error("Purchase order not found");
        error.status = 404;
        throw error;
      }

      const invoiceResult = await client.query(
        `insert into invoices (po_id, invoice_number, tax, total_amount, status)
         values ($1, $2, coalesce($3, 0), coalesce($4, 0), 'Pending')
         returning *`,
        [po.id, makeInvoiceNumber(), 0, 0]
      );

      await createActivityLog(client, {
        actorId: req.user?.id,
        module: "Invoice",
        action: "Generated invoice from purchase order",
        referenceId: invoiceResult.rows[0].id,
      });

      return invoiceResult.rows[0];
    });

    return sendOk(res, invoice, 201);
  })
);

router.get(
  "/invoices/:id/pdf",
  asyncHandler(async (req, res) => {
    const { rows } = await query("select * from invoices where id = $1", [req.params.id]);

    if (!rows[0]) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    const invoice = rows[0];
    const pdf = createPdfBuffer([
      "VendorBridge Invoice",
      `Invoice: ${invoice.invoice_number || invoice.id}`,
      `Status: ${invoice.status || "pending"}`,
      `Total: ${invoice.total_amount || 0}`,
    ]);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${invoice.invoice_number || invoice.id}.pdf"`);
    return res.end(pdf);
  })
);

export default router;
