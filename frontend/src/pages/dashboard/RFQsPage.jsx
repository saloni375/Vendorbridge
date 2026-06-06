import { useState } from "react";
import { PlusCircle, Send, Upload } from "lucide-react";
import StatusBadge from "../../components/common/StatusBadge.jsx";
import { useAuth } from "../../hooks/useAuth.js";
import { ROLES } from "../../utils/roles.js";
import { formatCurrency, formatDate } from "../../utils/formatters.js";

const mockRFQs = [
  { id: "RFQ-2025-0068", title: "Office Furniture procurement Q2", category: "Furniture", status: "Active", budget: 230000, dueDate: "2025-06-15", vendors: ["Infra Supplies Pvt Ltd", "TechCore LTD", "Office Need Co."], quoteCount: 3 },
  { id: "RFQ-2025-0062", title: "IT hardware refresh", category: "IT", status: "Pending", budget: 140000, dueDate: "2025-06-20", vendors: ["TechCore LTD"], quoteCount: 1 },
  { id: "RFQ-2025-0058", title: "Logistics partner verification", category: "Logistics", status: "Blocked", budget: 34900, dueDate: "2025-06-08", vendors: ["FastLog Transport"], quoteCount: 0 },
];

const vendorOptions = [
  "Infra Supplies Pvt Ltd", "TechCore LTD", "Office Need Co.", "FastLog Transport",
];

const steps = ["Details", "Line Items", "Assign & Send"];

export default function RFQsPage() {
  const { currentUser } = useAuth();
  const [rfqs, setRfqs] = useState(mockRFQs);
  const [activeStep, setActiveStep] = useState(0);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({ title: "Office furniture procurement Q2", category: "Furniture", lineItems: "Ergonomic chair - 25 NOS; Standing desks - 10 NOS", budget: "230000", dueDate: "2025-06-15", vendors: [] });
  const canCreate = [ROLES.ADMIN, ROLES.PROCUREMENT_OFFICER].includes(currentUser?.role);

  const toggleVendor = (v) => {
    setForm((f) => ({
      ...f,
      vendors: f.vendors.includes(v) ? f.vendors.filter((x) => x !== v) : [...f.vendors, v],
    }));
  };

  const submit = () => {
    const newRfq = {
      id: `RFQ-2025-00${rfqs.length + 69}`,
      title: form.title,
      category: form.category,
      status: "Active",
      budget: Number(form.budget),
      dueDate: form.dueDate,
      vendors: form.vendors,
      quoteCount: 0,
    };
    setRfqs((prev) => [newRfq, ...prev]);
    setMessage(`${newRfq.id} created and sent to ${form.vendors.length} vendor(s).`);
    setActiveStep(0);
    setForm({ title: "", category: "", lineItems: "", budget: "", dueDate: "", vendors: [] });
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-brand-600">Request For Quotation</p>
        <h1 className="mt-1 text-2xl font-bold text-gray-950">Create RFQ's</h1>
        <p className="mt-1 text-sm text-gray-500">New request for quotation</p>
      </div>

      {message && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</div>
      )}

      {canCreate && (
        <section className="grid gap-6 xl:grid-cols-[420px_minmax(0,1fr)]">
          {/* Create form */}
          <div className="rounded-xl border border-line bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                <PlusCircle className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-gray-950">Create RFQ</h2>
                <p className="text-xs text-gray-500">New request for quotation.</p>
              </div>
            </div>

            {/* Step indicator */}
            <div className="flex items-center gap-2 mb-5">
              {steps.map((s, i) => (
                <div key={s} className="flex items-center gap-2">
                  <div
                    className={`h-6 w-6 rounded-full text-xs font-bold flex items-center justify-center ${
                      i < activeStep ? "bg-brand-500 text-white" : i === activeStep ? "bg-brand-600 text-white" : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {i < activeStep ? "✓" : i + 1}
                  </div>
                  <span className={`text-xs ${i === activeStep ? "font-semibold text-gray-900" : "text-gray-500"}`}>{s}</span>
                  {i < steps.length - 1 && <div className="h-px w-4 bg-gray-200" />}
                </div>
              ))}
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">RFQ Title</label>
                <input
                  className="h-9 w-full rounded-lg border border-line px-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  placeholder="Office Furniture procurement Q2"
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Category</label>
                  <select
                    className="h-9 w-full rounded-lg border border-line px-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                    value={form.category}
                    onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                  >
                    <option value="">Select</option>
                    {["Furniture", "IT", "Packaging", "Logistics", "Machinery", "Services"].map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Deadline</label>
                  <input
                    type="date"
                    className="h-9 w-full rounded-lg border border-line px-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                    value={form.dueDate}
                    onChange={(e) => setForm((f) => ({ ...f, dueDate: e.target.value }))}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Budget</label>
                <input
                  type="number"
                  className="h-9 w-full rounded-lg border border-line px-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  placeholder="2500000"
                  value={form.budget}
                  onChange={(e) => setForm((f) => ({ ...f, budget: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Line Items</label>
                <input
                  className="h-9 w-full rounded-lg border border-line px-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  placeholder="Ergonomic chair - 25 NOS; Standing desks - 10 NOS"
                  value={form.lineItems}
                  onChange={(e) => setForm((f) => ({ ...f, lineItems: e.target.value }))}
                />
              </div>

              {/* Assign vendors */}
              <div>
                <p className="text-xs font-medium text-gray-700 mb-1">Assign Vendors</p>
                <div className="space-y-1.5">
                  {vendorOptions.map((v) => (
                    <label key={v} className="flex items-center justify-between rounded-lg border border-line px-3 py-2 text-xs cursor-pointer hover:bg-gray-50">
                      <span className="font-medium text-gray-900">{v}</span>
                      <input
                        type="checkbox"
                        className="h-3.5 w-3.5 rounded border-line text-brand-600"
                        checked={form.vendors.includes(v)}
                        onChange={() => toggleVendor(v)}
                      />
                    </label>
                  ))}
                </div>
              </div>

              {/* Attachments */}
              <div>
                <p className="text-xs font-medium text-gray-700 mb-1">Attachments</p>
                <div className="rounded-lg border border-dashed border-line bg-gray-50 px-4 py-5 text-center">
                  <Upload className="h-5 w-5 text-gray-400 mx-auto mb-1" />
                  <p className="text-xs text-gray-500">Drag & drop files or click to select</p>
                </div>
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  onClick={submit}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 transition"
                >
                  <Send className="h-4 w-4" /> Save & Send to Vendors
                </button>
                <button className="flex-1 inline-flex items-center justify-center rounded-lg border border-line bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition">
                  Save as Draft
                </button>
              </div>
            </div>
          </div>

          {/* RFQ tracking table */}
          <div className="overflow-hidden rounded-xl border border-line bg-white shadow-sm">
            <div className="border-b border-line px-5 py-3">
              <h2 className="text-sm font-semibold text-gray-950">RFQ Tracking</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-line text-sm">
                <thead className="bg-gray-50 text-left text-xs font-semibold uppercase text-gray-500">
                  <tr>
                    <th className="px-5 py-3">RFQ</th>
                    <th className="px-5 py-3">Vendors</th>
                    <th className="px-5 py-3">Budget</th>
                    <th className="px-5 py-3">Quotes</th>
                    <th className="px-5 py-3">Due</th>
                    <th className="px-5 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {rfqs.map((rfq) => (
                    <tr key={rfq.id} className="hover:bg-gray-50">
                      <td className="px-5 py-3">
                        <p className="font-mono text-xs font-semibold text-gray-950">{rfq.id}</p>
                        <p className="text-xs text-gray-500">{rfq.title}</p>
                      </td>
                      <td className="px-5 py-3 text-xs text-gray-600">
                        {rfq.vendors?.slice(0, 2).join(", ")}
                        {rfq.vendors?.length > 2 && ` +${rfq.vendors.length - 2}`}
                      </td>
                      <td className="px-5 py-3 text-gray-700 text-xs">{formatCurrency(rfq.budget)}</td>
                      <td className="px-5 py-3 text-gray-700 text-xs">{rfq.quoteCount}</td>
                      <td className="px-5 py-3 text-gray-600 text-xs">{formatDate(rfq.dueDate)}</td>
                      <td className="px-5 py-3"><StatusBadge status={rfq.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
