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
            body { font-family: Arial, sans-serif; padding: 32px; color: #111827; }
            h1 { margin: 0 0 8px; }
            table { width: 100%; border-collapse: collapse; margin-top: 24px; }
            th, td { border: 1px solid #e5e7eb; padding: 12px; text-align: left; }
            th { background: #f3f4f6; }
            .total { font-size: 20px; font-weight: 700; }
          </style>
        </head>
        <body>
          <h1>VendorBridge Invoice</h1>
          <p><strong>Invoice:</strong> ${invoice.id}</p>
          <p><strong>PO:</strong> ${invoice.poId}</p>
          <p><strong>Vendor:</strong> ${invoice.vendorName}</p>
          <p><strong>Invoice Date:</strong> ${formatDate(invoice.invoiceDate)}</p>
          <table>
            <thead>
              <tr><th>Description</th><th>Amount</th></tr>
            </thead>
            <tbody>
              <tr><td>Taxable Amount</td><td>${formatCurrency(invoice.taxableAmount)}</td></tr>
              <tr><td>GST (${invoice.gstRate}%)</td><td>${formatCurrency(gstAmount)}</td></tr>
              <tr><td class="total">Total Amount</td><td class="total">${formatCurrency(total)}</td></tr>
            </tbody>
          </table>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    setMessage(`${invoice.id} opened for print or Save as PDF.`);
  };

  const emailInvoice = async (invoice) => {
    await invoicesApi.email(invoice.rawId || invoice.id);
    setMessage(`${invoice.id} email action prepared for ${invoice.vendorName}.`);
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
                        <Button onClick={() => openPrintableInvoice(invoice)} variant="secondary">
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
