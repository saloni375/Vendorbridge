import { useEffect, useState } from "react";
import { Download, Mail, Printer } from "lucide-react";
import Button from "../../components/common/Button.jsx";
import PageHeader from "../../components/common/PageHeader.jsx";
import StatusBadge from "../../components/common/StatusBadge.jsx";
import { invoices } from "../../data/procurementData.js";
import { invoicesApi } from "../../services/procurementService.js";
import {
  calculateGstAmount,
  calculateInvoiceTotal,
  formatCurrency,
  formatDate,
} from "../../utils/formatters.js";

export default function InvoicesPage() {
  const [invoiceList, setInvoiceList] = useState(invoices);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    invoicesApi
      .list()
      .then((rows) => {
        if (!isMounted) return;
        setInvoiceList(
          rows.map((invoice) => ({
            id: invoice.invoice_number || invoice.id,
            rawId: invoice.id,
            poId: invoice.po_id,
            vendorName: invoice.vendor_name || "Vendor",
            taxableAmount: Math.max(0, Number(invoice.total_amount || 0) - Number(invoice.tax || 0)),
            gstRate: Number(invoice.total_amount || 0) > 0
              ? Math.round((Number(invoice.tax || 0) / Math.max(1, Number(invoice.total_amount || 0) - Number(invoice.tax || 0))) * 100)
              : 18,
            invoiceDate: invoice.created_at,
            dueDate: invoice.created_at,
            status: invoice.status || "Pending",
          }))
        );
      })
      .catch((error) => setMessage(error.message || "Could not load invoices from database."));

    return () => {
      isMounted = false;
    };
  }, []);

  const downloadPdf = async (invoice) => {
    const response = await invoicesApi.downloadPdf(invoice.rawId || invoice.id);
    const url = URL.createObjectURL(response.data);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${invoice.id}.pdf`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    setMessage(`${invoice.id} PDF downloaded.`);
  };

  const openPrintableInvoice = (invoice) => {
    const gstAmount = calculateGstAmount(invoice.taxableAmount, invoice.gstRate);
    const total = calculateInvoiceTotal(invoice.taxableAmount, invoice.gstRate);
    const printWindow = window.open("", "_blank", "width=900,height=700");

    if (!printWindow) {
      setMessage("Popup blocked. Please allow popups to print or save invoice PDF.");
      return;
    }

    // Browser print dialog lets users save the generated invoice as PDF.
    printWindow.document.write(`
      <html>
        <head>
          <title>${invoice.id}</title>
          <style>
            * { box-sizing: border-box; }
            body { font-family: Arial, sans-serif; margin: 0; padding: 40px; color: #111827; }
            .header { display: flex; justify-content: space-between; border-bottom: 2px solid #111827; padding-bottom: 20px; }
            .brand { font-size: 28px; font-weight: 800; margin: 0; }
            .meta { text-align: right; color: #4b5563; line-height: 1.7; }
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-top: 28px; }
            .box { border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; }
            .label { color: #6b7280; font-size: 12px; text-transform: uppercase; font-weight: 700; }
            table { width: 100%; border-collapse: collapse; margin-top: 28px; }
            th, td { border-bottom: 1px solid #e5e7eb; padding: 14px; text-align: left; }
            th { background: #f9fafb; color: #374151; font-size: 12px; text-transform: uppercase; }
            .amount { text-align: right; }
            .total { font-size: 20px; font-weight: 700; }
            .footer { margin-top: 36px; color: #6b7280; font-size: 12px; }
            @media print { body { padding: 24px; } button { display: none; } }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <h1 class="brand">VendorBridge</h1>
              <p>Procurement & Vendor Management ERP</p>
            </div>
            <div class="meta">
              <strong>Invoice ${invoice.id}</strong><br />
              PO ${invoice.poId || "N/A"}<br />
              ${formatDate(invoice.invoiceDate)}
            </div>
          </div>
          <div class="grid">
            <div class="box"><p class="label">Bill To</p><strong>Procurement Department</strong><br />VendorBridge Organization</div>
            <div class="box"><p class="label">Vendor</p><strong>${invoice.vendorName}</strong><br />Status: ${invoice.status}</div>
          </div>
          <table>
            <thead>
              <tr><th>Description</th><th class="amount">Amount</th></tr>
            </thead>
            <tbody>
              <tr><td>Taxable Amount</td><td class="amount">${formatCurrency(invoice.taxableAmount)}</td></tr>
              <tr><td>GST (${invoice.gstRate}%)</td><td class="amount">${formatCurrency(gstAmount)}</td></tr>
              <tr><td class="total">Total Amount</td><td class="amount total">${formatCurrency(total)}</td></tr>
            </tbody>
          </table>
          <p class="footer">Generated by VendorBridge. This document is valid for procurement audit and payment processing.</p>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    setMessage(`${invoice.id} opened for print or Save as PDF.`);
  };

  const emailInvoice = async (invoice) => {
    const result = await invoicesApi.email(invoice.rawId || invoice.id, { to: invoice.vendorEmail });
    setMessage(result.message || `${invoice.id} email queued for ${invoice.vendorName}.`);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        description="Invoices are generated from approved POs with GST calculation. Users can print, save as PDF, and email invoice copies."
        eyebrow="GST Invoicing"
        title="Invoices"
      />

      {message ? (
        <div className="rounded-lg border border-brand-100 bg-brand-50 px-4 py-3 text-sm text-brand-700">
          {message}
        </div>
      ) : null}

      <div className="overflow-hidden rounded-lg border border-line bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-line text-sm">
            <thead className="bg-gray-50 text-left text-xs font-semibold uppercase text-gray-500">
              <tr>
                <th className="px-5 py-3">Invoice</th>
                <th className="px-5 py-3">Vendor</th>
                <th className="px-5 py-3">Taxable</th>
                <th className="px-5 py-3">GST</th>
                <th className="px-5 py-3">Total</th>
                <th className="px-5 py-3">Due</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {invoiceList.map((invoice) => {
                const gstAmount = calculateGstAmount(invoice.taxableAmount, invoice.gstRate);
                const total = calculateInvoiceTotal(invoice.taxableAmount, invoice.gstRate);

                return (
                  <tr className="hover:bg-gray-50" key={invoice.id}>
                    <td className="px-5 py-4">
                      <p className="font-semibold text-gray-950">{invoice.id}</p>
                      <p className="mt-1 text-xs text-gray-500">{invoice.poId}</p>
                    </td>
                    <td className="px-5 py-4 text-gray-700">{invoice.vendorName}</td>
                    <td className="whitespace-nowrap px-5 py-4 text-gray-700">
                      {formatCurrency(invoice.taxableAmount)}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-gray-700">
                      {invoice.gstRate}% / {formatCurrency(gstAmount)}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 font-semibold text-gray-950">
                      {formatCurrency(total)}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-gray-600">
                      {formatDate(invoice.dueDate)}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4">
                      <StatusBadge status={invoice.status} />
                    </td>
                    <td className="whitespace-nowrap px-5 py-4">
                      <div className="flex gap-2">
                        <Button onClick={() => downloadPdf(invoice)} variant="secondary">
                          <Download className="h-4 w-4" aria-hidden="true" />
                          PDF
                        </Button>
                        <Button onClick={() => openPrintableInvoice(invoice)} variant="secondary">
                          <Printer className="h-4 w-4" aria-hidden="true" />
                          Print
                        </Button>
                        <Button onClick={() => emailInvoice(invoice)} variant="secondary">
                          <Mail className="h-4 w-4" aria-hidden="true" />
                          Email
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
