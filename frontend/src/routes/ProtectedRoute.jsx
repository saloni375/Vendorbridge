import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuth } from "../hooks/useAuth.js";

export default function ProtectedRoute() {
  const { initializing, isAuthenticated } = useAuth();
  const location = useLocation();

  // Avoid flashing protected content while localStorage is being restored.
  if (initializing) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 text-brand-600">
        <Loader2 className="h-8 w-8 animate-spin" aria-hidden="true" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate replace state={{ from: location }} to="/login" />;
  }

  return <Outlet />;
}
