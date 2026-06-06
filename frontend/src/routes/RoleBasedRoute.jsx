import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";

export default function RoleBasedRoute({ allowedRoles }) {
  const { currentUser } = useAuth();

  // Roles are centralized in utils/roles.js so labels and permissions stay aligned.
  if (!allowedRoles.includes(currentUser?.role)) {
    return <Navigate replace to="/unauthorized" />;
  }

  return <Outlet />;
}
