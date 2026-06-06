import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar.jsx";
import TopNavbar from "../components/layout/TopNavbar.jsx";

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // The shell owns responsive navigation while child routes own page content.
  return (
    <div className="min-h-screen bg-gray-50 lg:flex">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="min-w-0 flex-1">
        <TopNavbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
