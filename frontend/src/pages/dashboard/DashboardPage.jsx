import { useState } from "react";
import { BarChart3, ClipboardCheck, FileText, Plus, Receipt, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import StatusBadge from "../../components/common/StatusBadge.jsx";
import WorkflowStepper from "../../components/workflow/WorkflowStepper.jsx";
import { formatCurrency, formatDate } from "../../utils/formatters.js";

const kpis = [
  { label: "Active RFQs", value: 12, sub: "Office Furniture Q2", icon: FileText, color: "text-blue-600 bg-blue-50" },
  { label: "Pending Approvals", value: 5, sub: "L2 review waiting", icon: ClipboardCheck, color: "text-amber-600 bg-amber-50" },
  { label: "POs This Month", value: "₹2.3L", sub: "May 2025", icon: ShoppingCart, color: "text-brand-600 bg-brand-50" },
  { label: "Overdue Invoices", value: 3, sub: "Needs follow-up", icon: Receipt, color: "text-red-600 bg-red-50" },
];

const recentPOs = [
  { id: "PO-2025-0068", ref: "RFQ-2025-0068", vendor: "Infra Supplies Pvt Ltd", amount: 199910, status: "Pending Payment" },
  { id: "PO-2025-0062", ref: "RFQ-2025-0062", vendor: "TechCore LTD", amount: 165200, status: "Approved" },
  { id: "PO-2025-0058", ref: "RFQ-2025-0058", vendor: "FastLog Transport", amount: 41182, status: "Overdue" },
];

const spendMonths = [
  { month: "Jan", value: 85 }, { month: "Feb", value: 62 }, { month: "Mar", value: 110 },
  { month: "Apr", value: 95 }, { month: "May", value: 148 }, { month: "Jun", value: 72 },
];

export default function DashboardPage() {
  const navigate = useNavigate();
  const maxVal = Math.max(...spendMonths.map(m => m.value));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-brand-600">VendorBridge</p>
          <h1 className="mt-1 text-2xl font-bold text-gray-950">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">Welcome back, Procurement Officer – Today's Overview</p>
        </div>
        <div className="rounded-lg border border-line bg-white px-3 py-2 text-sm text-gray-600 shadow-sm shrink-0">
          May 2025
        </div>
      </div>

      <WorkflowStepper activeIndex={3} />

      {/* KPIs */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <article key={kpi.label} className="rounded-xl border border-line bg-white p-5 shadow-sm">
              <div className={`inline-flex h-10 w-10 items-center justify-center rounded-lg ${kpi.color}`}>
                <Icon className="h-5 w-5" />
              </div>
              <p className="mt-3 text-2xl font-bold text-gray-950">{kpi.value}</p>
              <p className="mt-1 text-sm font-medium text-gray-700">{kpi.label}</p>
              <p className="mt-0.5 text-xs text-gray-500">{kpi.sub}</p>
            </article>
          );
        })}
      </section>

      {/* Chart + Recent POs */}
      <section className="grid gap-6 xl:grid-cols-[1fr_1.4fr]">
        {/* Spending chart */}
        <div className="rounded-xl border border-line bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-gray-950">Procurement Spend</h2>
            <span className="text-xs text-gray-500">2025 monthly (₹K)</span>
          </div>
          <div className="flex items-end gap-2 h-28">
            {spendMonths.map((m) => (
              <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full rounded-t bg-brand-500 transition-all"
                  style={{ height: `${(m.value / maxVal) * 100}%`, minHeight: 4 }}
                />
                <span className="text-xs text-gray-500">{m.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent POs */}
        <div className="overflow-hidden rounded-xl border border-line bg-white shadow-sm">
          <div className="border-b border-line px-5 py-3 flex items-center justify-between">
            <h2 className="text-base font-semibold text-gray-950">Recent Purchase Orders</h2>
            <button onClick={() => navigate("/app/purchase-orders")} className="text-xs font-semibold text-brand-600 hover:underline">View all</button>
          </div>
          <table className="min-w-full divide-y divide-line text-sm">
            <thead className="bg-gray-50 text-left text-xs font-semibold uppercase text-gray-500">
              <tr>
                <th className="px-5 py-3">PO / Ref</th>
                <th className="px-5 py-3">Vendor</th>
                <th className="px-5 py-3">Amount</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {recentPOs.map((po) => (
                <tr key={po.id} className="hover:bg-gray-50">
                  <td className="px-5 py-3">
                    <p className="font-semibold text-gray-950 font-mono text-xs">{po.id}</p>
                    <p className="text-xs text-gray-500">{po.ref}</p>
                  </td>
                  <td className="px-5 py-3 text-gray-700 text-xs">{po.vendor}</td>
                  <td className="px-5 py-3 font-semibold text-gray-950 text-xs">{formatCurrency(po.amount)}</td>
                  <td className="px-5 py-3"><StatusBadge status={po.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => navigate("/app/rfqs")}
          className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 transition"
        >
          <Plus className="h-4 w-4" /> New RFQ
        </button>
        <button
          onClick={() => navigate("/app/vendors")}
          className="inline-flex items-center gap-2 rounded-lg border border-line bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
        >
          Add Vendor
        </button>
        <button
          onClick={() => navigate("/app/reports")}
          className="inline-flex items-center gap-2 rounded-lg border border-line bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
        >
          <BarChart3 className="h-4 w-4" /> View Reports
        </button>
      </div>
    </div>
  );
}
