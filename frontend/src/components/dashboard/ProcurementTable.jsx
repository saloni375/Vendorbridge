import StatusBadge from "../common/StatusBadge.jsx";
import { formatCurrency, formatDate } from "../../utils/formatters.js";

const rows = [
  {
    id: "RFQ-1028",
    vendor: "Northstar Industrial",
    category: "Packaging",
    value: 187500,
    status: "Review",
    dueDate: "2026-06-18",
  },
  {
    id: "PO-7741",
    vendor: "Helio Manufacturing",
    category: "Machinery",
    value: 642000,
    status: "Approved",
    dueDate: "2026-06-24",
  },
  {
    id: "INV-3390",
    vendor: "Everline Logistics",
    category: "Freight",
    value: 94800,
    status: "Pending",
    dueDate: "2026-06-29",
  },
  {
    id: "VEN-219",
    vendor: "Metroline Components",
    category: "Electronics",
    value: 238200,
    status: "Risk",
    dueDate: "2026-07-02",
  },
];

export default function ProcurementTable() {
  return (
    <div className="overflow-hidden rounded-lg border border-line bg-white shadow-sm">
      <div className="border-b border-line px-5 py-4">
        <h2 className="text-base font-semibold text-gray-950">Procurement Activity</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-line text-sm">
          <thead className="bg-gray-50 text-left text-xs font-semibold uppercase text-gray-500">
            <tr>
              <th className="px-5 py-3">Reference</th>
              <th className="px-5 py-3">Vendor</th>
              <th className="px-5 py-3">Category</th>
              <th className="px-5 py-3">Value</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Due Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line bg-white">
            {rows.map((row) => (
              <tr className="hover:bg-gray-50" key={row.id}>
                <td className="whitespace-nowrap px-5 py-4 font-semibold text-gray-950">
                  {row.id}
                </td>
                <td className="whitespace-nowrap px-5 py-4 text-gray-700">{row.vendor}</td>
                <td className="whitespace-nowrap px-5 py-4 text-gray-600">{row.category}</td>
                <td className="whitespace-nowrap px-5 py-4 text-gray-700">
                  {formatCurrency(row.value)}
                </td>
                <td className="whitespace-nowrap px-5 py-4">
                  <StatusBadge status={row.status} />
                </td>
                <td className="whitespace-nowrap px-5 py-4 text-gray-600">
                  {formatDate(row.dueDate)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
