import { Bell, Menu, Search } from "lucide-react";
import { useAuth } from "../../hooks/useAuth.js";
import { useNavigate } from "react-router-dom";

export default function TopNavbar({ onMenuClick }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-line bg-white px-4 sm:px-6">
      <div className="flex items-center gap-3">
        <button
          aria-label="Open navigation"
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 lg:hidden"
          onClick={onMenuClick}
          type="button"
        >
          <Menu className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>

      <div className="flex items-center gap-2">
        <button className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100">
          <Bell className="h-4 w-4" />
        </button>
        <button
          onClick={handleLogout}
          className="text-xs font-medium text-gray-600 hover:text-gray-900 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition"
        >
          Log out
        </button>
      </div>
    </header>
  );
}
