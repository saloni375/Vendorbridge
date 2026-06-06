import { Link } from "react-router-dom";
import Button from "../../components/common/Button.jsx";

export default function UnauthorizedPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md rounded-lg border border-line bg-white p-8 text-center shadow-soft">
        <p className="text-sm font-semibold uppercase text-red-600">Access Restricted</p>
        <h1 className="mt-2 text-2xl font-bold text-gray-950">Unauthorized</h1>
        <p className="mt-3 text-sm leading-6 text-gray-600">
          Your current role does not have permission to open this workspace.
        </p>
        <Link to="/app/dashboard">
          <Button className="mt-6" variant="primary">
            Back to Dashboard
          </Button>
        </Link>
      </div>
    </main>
  );
}
