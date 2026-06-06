import PageHeader from "../../components/common/PageHeader.jsx";
import StatusBadge from "../../components/common/StatusBadge.jsx";

const permissions = [
  { module: "RFQ Create", admin: true, procurement: true, manager: false, vendor: false },
  { module: "Submit Quotation", admin: false, procurement: false, manager: false, vendor: true },
  { module: "Compare Quotations", admin: true, procurement: true, manager: true, vendor: false },
  { module: "Approve Requests", admin: true, procurement: false, manager: true, vendor: false },
  { module: "Generate PO", admin: true, procurement: true, manager: false, vendor: false },
  { module: "Invoice PDF/Print/Email", admin: true, procurement: true, manager: true, vendor: true },
  { module: "Reports & Analytics", admin: true, procurement: true, manager: true, vendor: false },
];

function PermissionCell({ allowed }) {
  return <StatusBadge status={allowed ? "Approved" : "Rejected"} />;
}

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        description="Configure role permissions for the procurement workflow and prepare integrations for email, PDF generation, and backend APIs."
        eyebrow="Administration"
        title="Settings"
      />

      <div className="overflow-hidden rounded-lg border border-line bg-white shadow-sm">
        <div className="border-b border-line px-5 py-4">
          <h2 className="text-base font-semibold text-gray-950">Role Permission Matrix</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-line text-sm">
            <thead className="bg-gray-50 text-left text-xs font-semibold uppercase text-gray-500">
              <tr>
                <th className="px-5 py-3">Module</th>
                <th className="px-5 py-3">Admin</th>
                <th className="px-5 py-3">Procurement Officer</th>
                <th className="px-5 py-3">Manager</th>
                <th className="px-5 py-3">Vendor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {permissions.map((permission) => (
                <tr className="hover:bg-gray-50" key={permission.module}>
                  <td className="whitespace-nowrap px-5 py-4 font-semibold text-gray-950">
                    {permission.module}
                  </td>
                  <td className="whitespace-nowrap px-5 py-4">
                    <PermissionCell allowed={permission.admin} />
                  </td>
                  <td className="whitespace-nowrap px-5 py-4">
                    <PermissionCell allowed={permission.procurement} />
                  </td>
                  <td className="whitespace-nowrap px-5 py-4">
                    <PermissionCell allowed={permission.manager} />
                  </td>
                  <td className="whitespace-nowrap px-5 py-4">
                    <PermissionCell allowed={permission.vendor} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <section className="grid gap-4 md:grid-cols-3">
        {["SMTP Email Service", "PDF Invoice Renderer", "ERP Backend API"].map((item) => (
          <article className="rounded-lg border border-line bg-white p-5 shadow-sm" key={item}>
            <p className="text-sm font-semibold text-gray-950">{item}</p>
            <p className="mt-2 text-sm leading-6 text-gray-600">
              Ready for backend configuration when APIs are available.
            </p>
          </article>
        ))}
      </section>
    </div>
  );
}
