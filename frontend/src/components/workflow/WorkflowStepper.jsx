import { CheckCircle2 } from "lucide-react";
import { workflowSteps } from "../../data/procurementData.js";
import { cn } from "../../utils/cn.js";

export default function WorkflowStepper({ activeIndex = 2 }) {
  return (
    <div className="rounded-lg border border-line bg-white p-5 shadow-sm">
      <div className="grid gap-3 md:grid-cols-5">
        {workflowSteps.map((step, index) => {
          const isDone = index <= activeIndex;

          return (
            <div
              className={cn(
                "rounded-lg border p-4",
                isDone ? "border-brand-100 bg-brand-50" : "border-line bg-white"
              )}
              key={step.label}
            >
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold",
                  isDone ? "bg-brand-600 text-white" : "bg-gray-100 text-gray-500"
                )}
              >
                {isDone ? <CheckCircle2 className="h-4 w-4" aria-hidden="true" /> : index + 1}
              </div>
              <p className="mt-3 text-sm font-semibold text-gray-950">{step.label}</p>
              <p className="mt-1 text-xs leading-5 text-gray-500">{step.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
