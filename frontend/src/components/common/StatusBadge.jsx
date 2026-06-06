import { cn } from "../../utils/cn.js";

const styles = {
  approved: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  active: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  closed: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  paid: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  selected: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  pending: "bg-amber-50 text-amber-700 ring-amber-200",
  open: "bg-blue-50 text-blue-700 ring-blue-200",
  review: "bg-blue-50 text-blue-700 ring-blue-200",
  evaluation: "bg-blue-50 text-blue-700 ring-blue-200",
  submitted: "bg-blue-50 text-blue-700 ring-blue-200",
  generated: "bg-indigo-50 text-indigo-700 ring-indigo-200",
  dispatched: "bg-indigo-50 text-indigo-700 ring-indigo-200",
  risk: "bg-red-50 text-red-700 ring-red-200",
  high: "bg-red-50 text-red-700 ring-red-200",
  medium: "bg-amber-50 text-amber-700 ring-amber-200",
  low: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  rejected: "bg-red-50 text-red-700 ring-red-200",
  draft: "bg-gray-100 text-gray-700 ring-gray-200",
};

export default function StatusBadge({ status }) {
  const normalized = status.toLowerCase();

  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1",
        styles[normalized] || styles.draft
      )}
    >
      {status}
    </span>
  );
}
