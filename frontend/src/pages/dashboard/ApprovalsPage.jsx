import { useState } from "react";
import { CheckCircle2, XCircle, User } from "lucide-react";
import StatusBadge from "../../components/common/StatusBadge.jsx";
import { formatCurrency } from "../../utils/formatters.js";

const workflowSteps = ["Submitted", "L1 Review", "L2 Review", "Approved"];

const mockApprovals = [
  {
    id: "APR-2025-018",
    rfq: "RFQ: Office Furniture Q2 – Vendor: Infra Supplies – ₹185900",
    type: "Vendor Selection",
    vendorName: "Infra Supplies Pvt Ltd",
    amount: 185900,
    priority: "High",
    status: "Pending",
    activeStep: 2,
    chain: [
      { name: "Rahul Mehta", role: "L1 Manager", status: "Approved", initials: "RM" },
      { name: "Priya Shah", role: "L2 Director", status: "Pending", initials: "PS" },
    ],
    delivery: "10 days",
    warranty: "1 year",
    remarks: "",
  },
  {
    id: "APR-2025-017",
    rfq: "RFQ-2025-0068 L1 Review",
    type: "L1 Review",
    vendorName: "Infra Supplies Pvt Ltd",
    amount: 185900,
    priority: "Medium",
    status: "Approved",
    activeStep: 3,
    chain: [
      { name: "Rahul Mehta", role: "L1 Manager", status: "Approved", initials: "RM" },
    ],
    delivery: "10 days",
    warranty: "1 year",
    remarks: "Approved by Rahul Mehta on 20 May 2025.",
  },
];

export default function ApprovalsPage() {
  const [approvals, setApprovals] = useState(mockApprovals);
  const [message, setMessage] = useState("");

  const decide = (id, decision) => {
    setApprovals((prev) =>
      prev.map((a) =>
        a.id === id
          ? { ...a, status: decision, activeStep: decision === "Approved" ? 3 : a.activeStep }
          : a
      )
    );
    setMessage(
      decision === "Approved"
        ? `${id} approved. Purchase Order will be generated.`
        : `${id} rejected and returned to procurement.`
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-brand-600">Manager Desk</p>
        <h1 className="mt-1 text-2xl font-bold text-gray-950">Approval Workflow</h1>
      </div>

      {message && (
        <div className="rounded-lg border border-brand-100 bg-brand-50 px-4 py-3 text-sm text-brand-700">
          {message}
        </div>
      )}

      <div className="grid gap-5 xl:grid-cols-2">
        {approvals.map((approval) => (
          <article key={approval.id} className="rounded-xl border border-line bg-white p-5 shadow-sm">
            {/* Title */}
            <div className="flex items-start justify-between gap-3 mb-4">
              <div>
                <p className="text-xs font-mono text-gray-500">{approval.id}</p>
                <h2 className="mt-1 text-sm font-semibold text-gray-950">{approval.rfq}</h2>
              </div>
              <StatusBadge status={approval.status} />
            </div>

            {/* 4-step workflow tracker */}
            <div className="mb-4">
              <div className="flex items-center gap-0">
                {workflowSteps.map((step, i) => (
                  <div key={step} className="flex items-center flex-1">
                    <div className="flex flex-col items-center">
                      <div
                        className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          i < approval.activeStep
                            ? "bg-brand-500 text-white"
                            : i === approval.activeStep
                            ? "bg-amber-400 text-white"
                            : "bg-gray-200 text-gray-500"
                        }`}
                      >
                        {i < approval.activeStep ? "✓" : i + 1}
                      </div>
                      <p className="mt-1 text-xs text-gray-500 whitespace-nowrap">{step}</p>
                    </div>
                    {i < workflowSteps.length - 1 && (
                      <div className={`flex-1 h-0.5 mb-4 mx-1 ${i < approval.activeStep ? "bg-brand-500" : "bg-gray-200"}`} />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Approval chain */}
            <div className="mb-4 space-y-2">
              <p className="text-xs font-semibold text-gray-500 uppercase">Approval Chain</p>
              {approval.chain.map((person) => (
                <div key={person.name} className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2">
                  <div className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-full bg-brand-100 flex items-center justify-center">
                      <span className="text-xs font-bold text-brand-700">{person.initials}</span>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-900">{person.name}</p>
                      <p className="text-xs text-gray-500">{person.role}</p>
                    </div>
                  </div>
                  <StatusBadge status={person.status} />
                </div>
              ))}
            </div>

            {/* Summary */}
            <dl className="grid grid-cols-2 gap-2 text-xs mb-4">
              <div className="rounded-lg bg-gray-50 p-2">
                <dt className="text-gray-500">Amount</dt>
                <dd className="font-semibold text-gray-900 mt-0.5">{formatCurrency(approval.amount)}</dd>
              </div>
              <div className="rounded-lg bg-gray-50 p-2">
                <dt className="text-gray-500">Delivery</dt>
                <dd className="font-semibold text-gray-900 mt-0.5">{approval.delivery}</dd>
              </div>
              <div className="rounded-lg bg-gray-50 p-2">
                <dt className="text-gray-500">Priority</dt>
                <dd className="mt-0.5"><StatusBadge status={approval.priority} /></dd>
              </div>
              <div className="rounded-lg bg-gray-50 p-2">
                <dt className="text-gray-500">Warranty</dt>
                <dd className="font-semibold text-gray-900 mt-0.5">{approval.warranty}</dd>
              </div>
            </dl>

            {/* Add comment */}
            <div className="mb-4">
              <textarea
                className="w-full rounded-lg border border-line px-3 py-2 text-xs placeholder:text-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-brand-500"
                rows={2}
                placeholder="Add your comments or reasoning..."
              />
            </div>

            <div className="flex gap-2">
              <button
                disabled={approval.status !== "Pending"}
                onClick={() => decide(approval.id, "Approved")}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <CheckCircle2 className="h-4 w-4" /> Approve
              </button>
              <button
                disabled={approval.status !== "Pending"}
                onClick={() => decide(approval.id, "Rejected")}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg border border-line bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <XCircle className="h-4 w-4" /> Reject
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
