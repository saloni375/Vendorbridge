import { Link } from "react-router-dom";
import Button from "../../components/common/Button.jsx";

export default function NotFoundPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md rounded-lg border border-line bg-white p-8 text-center shadow-soft">
        <p className="text-sm font-semibold uppercase text-brand-600">404</p>
        <h1 className="mt-2 text-2xl font-bold text-gray-950">Page not found</h1>
        <p className="mt-3 text-sm leading-6 text-gray-600">
          The page you requested is not available.
        </p>
        <Link to="/app/dashboard">
          <Button className="mt-6">Back to Dashboard</Button>
        </Link>
      </div>
    </main>
  );
}
