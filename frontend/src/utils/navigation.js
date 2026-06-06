import {
  BarChart3, ClipboardCheck, FileBarChart, FileCheck2,
  FileText, History, LayoutDashboard, Receipt, ShoppingCart, Store,
} from "lucide-react";
import { ROLES } from "./roles.js";

const everyone = [ROLES.ADMIN, ROLES.PROCUREMENT_OFFICER, ROLES.VENDOR, ROLES.MANAGER];

export const sidebarNavigation = [
  { label: "Dashboard", path: "/app/dashboard", icon: LayoutDashboard, roles: everyone },
  { label: "Vendors", path: "/app/vendors", icon: Store, roles: everyone },
  { label: "RFQ's", path: "/app/rfqs", icon: FileText, roles: everyone },
  { label: "Quotations", path: "/app/quotations", icon: FileCheck2, roles: everyone },
  { label: "Approvals", path: "/app/approvals", icon: ClipboardCheck, roles: everyone },
  { label: "Purchase orders", path: "/app/purchase-orders", icon: ShoppingCart, roles: everyone },
  { label: "Invoices", path: "/app/invoices", icon: Receipt, roles: everyone },
  { label: "Reports", path: "/app/reports", icon: FileBarChart, roles: everyone },
  { label: "Activity", path: "/app/activity", icon: History, roles: everyone },
];
