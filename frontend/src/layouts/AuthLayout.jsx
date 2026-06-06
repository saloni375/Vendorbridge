import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="mb-6 flex items-center justify-center gap-2">
          <div className="h-8 w-8 rounded bg-brand-500 flex items-center justify-center">
            <span className="text-white text-sm font-bold">VB</span>
          </div>
          <span className="text-xl font-bold text-gray-900">VendorBridge</span>
        </div>
        <Outlet />
      </div>
    </main>
  );
}
