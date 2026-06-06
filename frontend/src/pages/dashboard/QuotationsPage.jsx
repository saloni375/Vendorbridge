import { useState } from "react";
import { Award, Send } from "lucide-react";
import StatusBadge from "../../components/common/StatusBadge.jsx";
import { useAuth } from "../../hooks/useAuth.js";
import { ROLES } from "../../utils/roles.js";
import { formatCurrency } from "../../utils/formatters.js";

const mockQuotations = [
  { id: "QTN-2025-041", vendor: "Infra Supplies Pvt Ltd", chair: 3400, desk: 7500, warranty: "1 yr", delivery: "10 days", total: 185900, status: "Selected", isBest: true },
  { id: "QTN-2025-042", vendor: "TechCore LTD", chair: 3800, desk: 8200, warranty: "6 mo", delivery: "14 days", total: 200010, status: "Submitted", isBest: false },
  { id: "QTN-2025-043", vendor: "Office Need Co.", chair: 4100, desk: 8900, warranty: "1 yr", delivery: "7 days", total: 214800, status: "Submitted", isBest: false },
];

export default function QuotationsPage() {
  const { currentUser } = useAuth();
  const [view, setView] = useState("comparison");
  const [message, setMessage] = useState("");
  const [quotations, setQuotations] = useState(mockQuotations);
  const [submitForm, setSubmitForm] = useState({ chair: "", desk: "", warranty: "", delivery: "", notes: "" });
  const isVendor = currentUser?.role === ROLES.VENDOR;

  const selectVendor = (id) => {
    setQuotations((prev) => prev.map((q) => ({ ...q, status: q.id === id ? "Selected" : q.status === "Selected" ? "Submitted" : q.status })));
    setMessage(`${id} selected and forwarded to approval workflow.`);
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-brand-600">Vendor Quotations</p>
        <h1 className="mt-1 text-2xl font-bold text-gray-950">
          {isVendor ? "Submit Quotations" : "Quotation Comparison"}
        </h1>
        <p className="mt-1 text-sm text-gray-500">RFQ: Office Furniture procurement Q2 – Deadline 15 June 2025</p>
      </div>

      {message && (
        <div className="rounded-lg border border-brand-100 bg-brand-50 px-4 py-3 text-sm text-brand-700">{message}</div>
      )}

      {/* Toggle */}
      <div className="flex gap-2">
        {["comparison", "submit"].map((v) => (
          <button
            key={v}
            onClick={() => setView(v)}
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
              view === v ? "bg-brand-600 text-white" : "border border-line bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            {v === "comparison" ? "Quotation Comparison" : "Submit Quotation"}
          </button>
        ))}
      </div>

      {view === "submit" && (
        <div className="rounded-xl border border-line bg-white p-5 shadow-sm">
          <h2 className="text-base font-semibold text-gray-950 mb-4">Submit Quotation</h2>
          <p className="text-sm text-gray-600 mb-4">RFQ: Office Furniture procurement Q2 – Deadline 15 June 2025</p>
          <div className="overflow-x-auto mb-4">
            <table className="min-w-full divide-y divide-line text-sm">
              <thead className="bg-gray-50 text-left text-xs font-semibold uppercase text-gray-500">
                <tr>
                  <th className="px-4 py-3">Item</th>
                  <th className="px-4 py-3">Qty</th>
                  <th className="px-4 py-3">Unit Price</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Delivery (days)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                <tr>
                  <td className="px-4 py-3 text-gray-900">Ergonomic Chair</td>
                  <td className="px-4 py-3 text-gray-700">25</td>
                  <td className="px-4 py-3">
                    <input className="w-24 rounded border border-line px-2 py-1 text-sm" placeholder="3500" type="number" />
                  </td>
                  <td className="px-4 py-3 text-gray-700">–</td>
                  <td className="px-4 py-3">
                    <input className="w-16 rounded border border-line px-2 py-1 text-sm" placeholder="10" type="number" />
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-gray-900">Standing Desk</td>
                  <td className="px-4 py-3 text-gray-700">10</td>
                  <td className="px-4 py-3">
                    <input className="w-24 rounded border border-line px-2 py-1 text-sm" placeholder="7500" type="number" />
                  </td>
                  <td className="px-4 py-3 text-gray-700">–</td>
                  <td className="px-4 py-3">
                    <input className="w-16 rounded border border-line px-2 py-1 text-sm" placeholder="10" type="number" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="grid grid-cols-3 gap-3 mb-4 text-sm">
            <div className="rounded-lg bg-gray-50 p-3">
              <p className="text-xs text-gray-500">GST (18%)</p>
              <p className="font-semibold text-gray-900">₹ –</p>
            </div>
            <div className="rounded-lg bg-gray-50 p-3">
              <p className="text-xs text-gray-500">Add 1 Items</p>
              <p className="font-semibold text-gray-900">+ Add line</p>
            </div>
            <div className="rounded-lg bg-brand-50 p-3">
              <p className="text-xs text-brand-600">Grand Total</p>
              <p className="font-bold text-brand-700">₹ 2,30,000</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 transition">
              <Send className="h-4 w-4" /> Submit Quotation
            </button>
            <button className="inline-flex items-center gap-2 rounded-lg border border-line bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition">
              Save Draft
            </button>
          </div>
        </div>
      )}

      {view === "comparison" && (
        <div className="overflow-hidden rounded-xl border border-line bg-white shadow-sm">
          <div className="border-b border-line px-5 py-3 flex items-center justify-between">
            <h2 className="text-base font-semibold text-gray-950">Quotation Comparison</h2>
            <p className="text-xs text-gray-500">RFQ: Office Furniture procurement Q2 – 3 quotations received</p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-line text-sm">
              <thead className="bg-gray-50 text-left text-xs font-semibold uppercase text-gray-500">
                <tr>
                  <th className="px-5 py-3">Criteria</th>
                  {quotations.map((q) => (
                    <th key={q.id} className={`px-5 py-3 ${q.isBest ? "text-brand-700" : ""}`}>
                      {q.vendor} {q.isBest && <span className="ml-1 text-brand-500">★ Lowest</span>}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {[
                  { key: "chair", label: "Chair Price" },
                  { key: "desk", label: "Desk Price" },
                  { key: "warranty", label: "Warranty" },
                  { key: "delivery", label: "Delivery" },
                  { key: "total", label: "Grand Total", bold: true },
                  { key: "status", label: "Status" },
                ].map((row) => (
                  <tr key={row.key} className={row.bold ? "bg-brand-50/30" : "hover:bg-gray-50"}>
                    <td className="px-5 py-3 font-medium text-gray-600">{row.label}</td>
                    {quotations.map((q) => (
                      <td
                        key={q.id}
                        className={`px-5 py-3 ${q.isBest ? "font-semibold text-brand-700" : "text-gray-700"}`}
                      >
                        {row.key === "status" ? (
                          <StatusBadge status={q.status} />
                        ) : row.key === "total" || row.key === "chair" || row.key === "desk" ? (
                          formatCurrency(q[row.key])
                        ) : (
                          q[row.key]
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="border-t border-line px-5 py-3 flex gap-2">
            {quotations.map((q) => (
              <button
                key={q.id}
                onClick={() => selectVendor(q.id)}
                disabled={q.status === "Selected"}
                className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                  q.isBest
                    ? "bg-brand-600 text-white hover:bg-brand-700"
                    : "border border-line bg-white text-gray-700 hover:bg-gray-50"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {q.status === "Selected" ? "✓ Selected" : "Select & Approve"}
              </button>
            ))}
          </div>
          <p className="px-5 py-2 text-xs text-gray-500 bg-gray-50">
            Green background highlights lowest-price vendor for the approval workflow.
          </p>
        </div>
      )}
    </div>
  );
}
