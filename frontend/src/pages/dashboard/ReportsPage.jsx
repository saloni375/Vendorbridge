import { BarChart3, Download } from "lucide-react";
import { formatCurrency } from "../../utils/formatters.js";

const kpis = [
  { label: "Total Spend", value: "₹12.4L", sub: "May 2025", color: "bg-brand-50 text-brand-700" },
  { label: "Active Vendors", value: 28, sub: "4 new this month", color: "bg-blue-50 text-blue-700" },
  { label: "On-time Delivery", value: "94%", sub: "vs 89% last month", color: "bg-emerald-50 text-emerald-700" },
  { label: "Monthly Savings", value: 3, sub: "vs budget target", color: "bg-amber-50 text-amber-700" },
];

const spendByCategory = [
  { category: "IT Hardware", amount: 740000, share: 59 },
  { category: "Furniture", amount: 232000, share: 19 },
  { category: "Stationery", amount: 165000, share: 13 },
  { category: "Printing", amount: 113000, share: 9 },
  { category: "Logistics", amount: 34000, share: 3 },
];

const topVendors = [
  { name: "TechCore Ltd", spend: 420000, pos: 4 },
  { name: "Infra Supplies", spend: 185900, pos: 2 },
  { name: "Office Need Co.", spend: 130000, pos: 3 },
];

const monthlyTrend = [
  { month: "Jan", val: 60 }, { month: "Feb", val: 48 }, { month: "Mar", val: 92 },
  { month: "Apr", val: 75 }, { month: "May", val: 124 }, { month: "Jun", val: 40 },
];
const maxTrend = Math.max(...monthlyTrend.map(m => m.val));

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-brand-600">Analytics</p>
          <h1 className="mt-1 text-2xl font-bold text-gray-950">Reports & Analytics</h1>
          <p className="mt-1 text-sm text-gray-500">Procurement Insights: May 2025</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="rounded-lg border border-line bg-white px-3 py-2 text-sm text-gray-600">
            May 2025
          </div>
          <button className="inline-flex items-center gap-2 rounded-lg border border-line bg-white px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition">
            <Download className="h-4 w-4" /> Export
          </button>
        </div>
      </div>

      {/* KPI Row */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi) => (
          <article key={kpi.label} className={`rounded-xl border border-line p-4 shadow-sm ${kpi.color}`}>
            <p className="text-2xl font-bold">{kpi.value}</p>
            <p className="mt-1 text-sm font-semibold">{kpi.label}</p>
            <p className="text-xs opacity-75 mt-0.5">{kpi.sub}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        {/* Spend by category */}
        <div className="rounded-xl border border-line bg-white p-5 shadow-sm">
          <h2 className="text-base font-semibold text-gray-950 mb-4">Spend by Category</h2>
          <div className="space-y-3">
            {spendByCategory.map((item) => (
              <div key={item.category}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="font-medium text-gray-800">{item.category}</span>
                  <span className="text-gray-600">{formatCurrency(item.amount)}</span>
                </div>
                <div className="h-2.5 rounded-full bg-gray-100">
                  <div
                    className="h-2.5 rounded-full bg-brand-500"
                    style={{ width: `${item.share}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top vendors */}
        <div className="rounded-xl border border-line bg-white p-5 shadow-sm">
          <h2 className="text-base font-semibold text-gray-950 mb-4">Top Vendors by Spend</h2>
          <table className="min-w-full text-sm">
            <thead className="text-left text-xs font-semibold uppercase text-gray-500">
              <tr>
                <th className="pb-3">Vendor</th>
                <th className="pb-3">Spend (₹)</th>
                <th className="pb-3">POs</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {topVendors.map((v) => (
                <tr key={v.name} className="hover:bg-gray-50">
                  <td className="py-3 font-medium text-gray-900">{v.name}</td>
                  <td className="py-3 text-gray-700">{formatCurrency(v.spend)}</td>
                  <td className="py-3 text-gray-700">{v.pos}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Monthly Trend chart */}
          <div className="mt-5">
            <p className="text-xs font-semibold uppercase text-gray-500 mb-3">Monthly Trend</p>
            <div className="flex items-end gap-2 h-20">
              {monthlyTrend.map((m) => (
                <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full rounded-t bg-blue-400"
                    style={{ height: `${(m.val / maxTrend) * 100}%`, minHeight: 3 }}
                  />
                  <span className="text-xs text-gray-500">{m.month}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
