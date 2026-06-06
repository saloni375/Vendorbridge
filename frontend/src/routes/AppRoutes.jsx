import { Navigate, Route, Routes } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout.jsx";
import DashboardLayout from "../layouts/DashboardLayout.jsx";
import LoginPage from "../pages/auth/LoginPage.jsx";
import SignupPage from "../pages/auth/SignupPage.jsx";
import ForgotPasswordPage from "../pages/auth/ForgotPasswordPage.jsx";
import DashboardPage from "../pages/dashboard/DashboardPage.jsx";
import VendorsPage from "../pages/dashboard/VendorsPage.jsx";
import RFQsPage from "../pages/dashboard/RFQsPage.jsx";
import QuotationsPage from "../pages/dashboard/QuotationsPage.jsx";
import ApprovalsPage from "../pages/dashboard/ApprovalsPage.jsx";
import PurchaseOrdersPage from "../pages/dashboard/PurchaseOrdersPage.jsx";
import InvoicesPage from "../pages/dashboard/InvoicesPage.jsx";
import ReportsPage from "../pages/dashboard/ReportsPage.jsx";
import ActivityLogsPage from "../pages/dashboard/ActivityLogsPage.jsx";
import NotFoundPage from "../pages/errors/NotFoundPage.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import PublicRoute from "./PublicRoute.jsx";

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicRoute />}>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route path="/app" element={<DashboardLayout />}>
          <Route index element={<Navigate replace to="/app/dashboard" />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="vendors" element={<VendorsPage />} />
          <Route path="rfqs" element={<RFQsPage />} />
          <Route path="quotations" element={<QuotationsPage />} />
          <Route path="approvals" element={<ApprovalsPage />} />
          <Route path="purchase-orders" element={<PurchaseOrdersPage />} />
          <Route path="invoices" element={<InvoicesPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="activity" element={<ActivityLogsPage />} />
        </Route>
      </Route>

      <Route path="/" element={<Navigate replace to="/login" />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
