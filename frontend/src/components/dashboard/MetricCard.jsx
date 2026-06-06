import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { cn } from "../../utils/cn.js";

export default function MetricCard({ change, icon: Icon, label, trend, value }) {
  const isPositive = trend === "up";

  return (
    <article className="rounded-lg border border-line bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{label}</p>
          <p className="mt-2 text-2xl font-bold text-gray-950">{value}</p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
      </div>
      <div
        className={cn(
          "mt-4 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold",
          isPositive ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
        )}
      >
        {isPositive ? (
          <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
        ) : (
          <ArrowDownRight className="h-3.5 w-3.5" aria-hidden="true" />
        )}
        {change}
      </div>
    </article>
  );
}
