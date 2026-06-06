import { useState } from "react";
import { Plus, Search } from "lucide-react";
import StatusBadge from "../../components/common/StatusBadge.jsx";
import { formatCurrency } from "../../utils/formatters.js";

const mockVendors = [
  { id: "VEN-001", name: "Infra Supplies Pvt Ltd", category: "Construction", contact: "procurement@infrasupplies.example", gstin: "27AABCS1429BZ0", rating: 4.5, compliance: "Active", risk: "Low", annualSpend: 420000 },
  { id: "VEN-002", name: "TechCore LTD", category: "IT", contact: "sales@techcore.example", gstin: "27AABCT0283G1Z2", rating: 4.2, compliance: "Active", risk: "Low", annualSpend: 185900 },
  { id: "VEN-003", name: "FastLog Transport", category: "Logistics", contact: "ops@fastlog.example", gstin: "27AABCF1829BZ0", rating: 3.1, compliance: "Blocked", risk: "High", annualSpend: 34900 },
  { id: "VEN-004", name: "Office Need Co.", category: "Furniture", contact: "procurement@officeneed.example", gstin: "24AAFCO9182L1Z3", rating: 3.8, compliance: "Pending", risk: "Medium", annualSpend: 130000 },
];

const statusFilters = ["All", "Active", "Pending", "Blocked"];

export default function VendorsPage() {
  const [vendors, setVendors] = useState(mockVendors);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showAdd, setShowAdd] = useState(false);
  const [newVendor, setNewVendor] = useState({ name: "", category: "", contact: "", gstin: "" });

  const visible = vendors.filter((v) => {
    const matchStatus = statusFilter === "All" || v.compliance === statusFilter;
    const matchSearch = !search.trim() ||
      `${v.name} ${v.gstin} ${v.category} ${v.contact}`.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const addVendor = () => {
    if (!newVendor.name) return;
    setVendors((prev) => [...prev, {
      id: `VEN-00${prev.length + 1}`,
      ...newVendor,
      rating: 3.0,
      compliance: "Pending",
      risk: "Medium",
      annualSpend: 0,
    }]);
    setNewVendor({ name: "", category: "", contact: "", gstin: "" });
    setShowAdd(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-brand-600">Vendor Master</p>
          <h1 className="mt-1 text-2xl font-bold text-gray-950">Vendors</h1>
          <p className="mt-1 text-sm text-gray-500">Manage supplier profiles and registrations</p>
        </div>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 transition"
        >
          <Plus className="h-4 w-4" /> Add Vendor
        </button>
      </div>

      {/* Add vendor form */}
      {showAdd && (
        <div className="rounded-xl border border-brand-200 bg-brand-50 p-4 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-950 mb-3">Add New Vendor</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { key: "name", placeholder: "Company name" },
              { key: "category", placeholder: "Category (Furniture, IT...)" },
              { key: "contact", placeholder: "Email / Phone" },
              { key: "gstin", placeholder: "GSTIN number" },
            ].map((field) => (
              <input
                key={field.key}
                className="h-9 rounded-lg border border-line bg-white px-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
                placeholder={field.placeholder}
                value={newVendor[field.key]}
                onChange={(e) => setNewVendor((p) => ({ ...p, [field.key]: e.target.value }))}
              />
            ))}
          </div>
          <div className="mt-3 flex gap-2">
            <button onClick={addVendor} className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 transition">
              Save Vendor
            </button>
            <button onClick={() => setShowAdd(false)} className="rounded-lg border border-line bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Search + filters */}
      <section className="rounded-xl border border-line bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <label className="relative block xl:w-96">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              className="h-10 w-full rounded-lg border border-line bg-white pl-9 pr-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
              placeholder="Search by name, GST number, job, category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </label>
          <div className="flex flex-wrap gap-2">
            {statusFilters.map((f) => (
              <button
                key={f}
                onClick={() => setStatusFilter(f)}
                className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition ${
                  statusFilter === f ? "bg-brand-600 text-white" : "border border-line bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-line bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-line text-sm">
            <thead className="bg-gray-50 text-left text-xs font-semibold uppercase text-gray-500">
              <tr>
                <th className="px-5 py-3">Vendor</th>
                <th className="px-5 py-3">Category</th>
                <th className="px-5 py-3">GSTIN</th>
                <th className="px-5 py-3">Addition no.</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {visible.map((vendor) => (
                <tr key={vendor.id} className="hover:bg-gray-50">
                  <td className="px-5 py-4">
                    <p className="font-semibold text-gray-950">{vendor.name}</p>
                    <p className="mt-0.5 text-xs text-gray-500">{vendor.contact}</p>
                  </td>
                  <td className="px-5 py-4 text-gray-700">{vendor.category}</td>
                  <td className="px-5 py-4 text-xs font-mono text-gray-600">{vendor.gstin}</td>
                  <td className="px-5 py-4 text-gray-700">{formatCurrency(vendor.annualSpend)}</td>
                  <td className="px-5 py-4"><StatusBadge status={vendor.compliance} /></td>
                  <td className="px-5 py-4">
                    <div className="flex gap-1">
                      <button className="rounded bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-200 transition">View</button>
                      <button className="rounded bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-200 transition">Edit</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
