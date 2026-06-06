import { useState } from "react";
import { LockKeyhole, Search } from "lucide-react";
import StatusBadge from "../../components/common/StatusBadge.jsx";

const filters = ["All", "RFQ", "Approvals", "Invoices", "Vendors"];

const mockLogs = [
  {
    id: "ACT-01",
    actor: "Procurement Officer",
    action: "Quotation selected – Infra Supplies Pvt Ltd selected for Office Furniture Q2 (₹1,85,900). Sent for manager approval.",
    module: "Approvals",
    time: "23 May 2025, 09:15 PM",
  },
  {
    id: "ACT-02",
    actor: "Priya Shah",
    action: "Approval pending – PO-2025-0068 awaiting L2 approval by Priya Shah (Director Ops).",
    module: "Approvals",
    time: "22 May 2025, 09:15 AM",
  },
  {
    id: "ACT-03",
    actor: "Procurement Officer",
    action: "RFQ published – Office Furniture Q2 sent to 3 vendors. Deadline 15 June 2025.",
    module: "RFQ",
    time: "19 May 2025",
  },
  {
    id: "ACT-04",
    actor: "Vendor Admin",
    action: "Vendor added – FastLog Transport registered and pending GST verification.",
    module: "Vendors",
    time: "18 May 2025, 03:20 PM",
  },
];

export default function ActivityLogsPage() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const visible = mockLogs.filter((log) => {
    const matchFilter = activeFilter === "All" || log.module === activeFilter;
    const matchSearch = !searchTerm.trim() ||
      `${log.actor} ${log.action} ${log.module}`.toLowerCase().includes(searchTerm.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-brand-600">Activity</p>
          <h1 className="mt-1 text-2xl font-bold text-gray-950">Activity & Logs</h1>
          <p className="mt-1 text-sm text-gray-500">Procurement audit trail</p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-700">
          <LockKeyhole className="h-3.5 w-3.5" />
          Audit logs are immutable – you can add notes, but cannot delete or modify existing logs
        </div>
      </div>

      {/* Filters + search */}
      <section className="rounded-xl border border-line bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition ${
                  activeFilter === filter
                    ? "bg-brand-600 text-white"
                    : "border border-line bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
          <label className="relative block lg:w-72">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              className="h-9 w-full rounded-lg border border-line bg-white pl-9 pr-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
              placeholder="Search audit trail"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </label>
        </div>
      </section>

      {/* Log entries */}
      <section className="rounded-xl border border-line bg-white shadow-sm overflow-hidden">
        <div className="border-b border-line px-5 py-3">
          <h2 className="text-base font-semibold text-gray-950">Procurement Audit Trail</h2>
        </div>
        <div className="divide-y divide-line">
          {visible.map((log) => (
            <article key={log.id} className="grid gap-3 px-5 py-4 md:grid-cols-[160px_minmax(0,1fr)_100px]">
              <div>
                <p className="text-sm font-semibold text-gray-950">{log.actor}</p>
                <p className="mt-1 text-xs text-gray-500">{log.time}</p>
              </div>
              <p className="text-sm leading-6 text-gray-700">{log.action}</p>
              <div className="md:text-right">
                <StatusBadge status={log.module} />
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
