import { useState } from "react";
import { FileText, Mail, Printer } from "lucide-react";
import StatusBadge from "../../components/common/StatusBadge.jsx";
import { formatCurrency } from "../../utils/formatters.js";

const mockPOs = [
  {
    id: "PO-2025-0068",
    subtitle: "auto-generated after approval",
    status: "Pending Payment",
    billTo: {
      company: "Your Organization Name",
      address: "123 business park, Andheri east",
      gstin: "27AABCS1429BZ0",
    },
    vendor: {
      name: "Infra Supplies Pvt Ltd",
      address: "456 industrial estate, Navi Mumbai",
      gstin: "27AAFCI8172H1Z5",
    },
    poDate: "22 May 2025",
    dueDate: "21 June 2025",
    items: [
      { name: "Ergonomic Chair", qty: 25, unit: "NOS", unitPrice: 3600, total: 90000 },
      { name: "Task Table CFG", qty: 10, unit: "NOS", unitPrice: 7950, total: 79500 },
    ],
    cgst: 9,
    sgst: 9,
    subTotal: 169500,
    cgstAmount: 15255,
    sgstAmount: 15255,
    grandTotal: 200010,
  },
];

export default function PurchaseOrdersPage() {
  const [message, setMessage] = useState("");

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-brand-600">PO Management</p>
        <h1 className="mt-1 text-2xl font-bold text-gray-950">Purchase Order & Invoice</h1>
      </div>

      {message && (
        <div className="rounded-lg border border-brand-100 bg-brand-50 px-4 py-3 text-sm text-brand-700">{message}</div>
      )}

      {mockPOs.map((po) => (
        <article key={po.id} className="rounded-xl border border-line bg-white p-6 shadow-sm">
          {/* PO Header */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-5">
            <div>
              <h2 className="text-xl font-bold text-gray-950 font-mono">{po.id}</h2>
              <p className="text-sm text-gray-500 mt-0.5">{po.subtitle}</p>
            </div>
            <div className="flex items-center gap-2">
              <StatusBadge status={po.status} />
              <div className="flex gap-1">
                <button className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-line text-gray-600 hover:bg-gray-50 transition">
                  <Printer className="h-3.5 w-3.5" />
                </button>
                <button className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-line text-gray-600 hover:bg-gray-50 transition">
                  <Mail className="h-3.5 w-3.5" />
                </button>
                <button className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-line text-gray-600 hover:bg-gray-50 transition">
                  <FileText className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Bill To / Vendor / Dates */}
          <div className="grid gap-4 md:grid-cols-3 mb-5">
            <div className="rounded-lg bg-gray-50 p-3">
              <p className="text-xs font-semibold uppercase text-gray-500 mb-1">Bill To</p>
              <p className="text-sm font-semibold text-gray-900">{po.billTo.company}</p>
              <p className="text-xs text-gray-500 mt-0.5">{po.billTo.address}</p>
              <p className="text-xs text-gray-500 mt-0.5">GSTIN: {po.billTo.gstin}</p>
            </div>
            <div className="rounded-lg bg-gray-50 p-3">
              <p className="text-xs font-semibold uppercase text-gray-500 mb-1">Vendor</p>
              <p className="text-sm font-semibold text-gray-900">{po.vendor.name}</p>
              <p className="text-xs text-gray-500 mt-0.5">{po.vendor.address}</p>
              <p className="text-xs text-gray-500 mt-0.5">GSTIN: {po.vendor.gstin}</p>
            </div>
            <div className="rounded-lg bg-gray-50 p-3">
              <p className="text-xs font-semibold uppercase text-gray-500 mb-1">Dates</p>
              <p className="text-xs text-gray-500">PO Date</p>
              <p className="text-sm font-semibold text-gray-900">{po.poDate}</p>
              <p className="text-xs text-gray-500 mt-2">Due Date</p>
              <p className="text-sm font-semibold text-gray-900">{po.dueDate}</p>
            </div>
          </div>

          {/* Items table */}
          <div className="overflow-x-auto mb-4">
            <table className="min-w-full divide-y divide-line text-sm">
              <thead className="bg-gray-50 text-left text-xs font-semibold uppercase text-gray-500">
                <tr>
                  <th className="px-4 py-3">Item</th>
                  <th className="px-4 py-3">Qty</th>
                  <th className="px-4 py-3">Unit</th>
                  <th className="px-4 py-3">Unit Price</th>
                  <th className="px-4 py-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {po.items.map((item) => (
                  <tr key={item.name} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{item.name}</td>
                    <td className="px-4 py-3 text-gray-700">{item.qty}</td>
                    <td className="px-4 py-3 text-gray-700">{item.unit}</td>
                    <td className="px-4 py-3 text-gray-700">{formatCurrency(item.unitPrice)}</td>
                    <td className="px-4 py-3 text-right font-semibold text-gray-950">{formatCurrency(item.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* GST Summary */}
          <div className="flex justify-end">
            <div className="w-64 space-y-1.5 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Sub Total</span>
                <span className="font-medium text-gray-900">{formatCurrency(po.subTotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">CGST ({po.cgst}%)</span>
                <span className="font-medium text-gray-900">{formatCurrency(po.cgstAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">SGST ({po.sgst}%)</span>
                <span className="font-medium text-gray-900">{formatCurrency(po.sgstAmount)}</span>
              </div>
              <div className="border-t border-line pt-2 flex justify-between">
                <span className="font-bold text-gray-950">Grand Total</span>
                <span className="font-bold text-brand-700 text-base">{formatCurrency(po.grandTotal)}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-5 flex items-center gap-3">
            <span className="text-sm text-gray-500">
              Mark as{" "}
              <span className="underline text-amber-600 cursor-pointer">Pending Payment</span>{" "}
              or{" "}
              <span
                className="underline text-brand-600 cursor-pointer"
                onClick={() => setMessage(`${po.id} marked as paid.`)}
              >
                Mark as Paid
              </span>
            </span>
          </div>
        </article>
      ))}
    </div>
  );
}
