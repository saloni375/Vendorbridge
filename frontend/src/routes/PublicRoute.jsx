import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";

export default function PublicRoute() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate replace to="/app/dashboard" />;
  }

  return <Outlet />;
}
