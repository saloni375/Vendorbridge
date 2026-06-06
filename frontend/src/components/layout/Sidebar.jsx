import { NavLink } from "react-router-dom";
import { X } from "lucide-react";
import { useAuth } from "../../hooks/useAuth.js";
import { sidebarNavigation } from "../../utils/navigation.js";
import { ROLE_LABELS } from "../../utils/roles.js";
import { cn } from "../../utils/cn.js";

export default function Sidebar({ isOpen, onClose }) {
  const { currentUser, logout } = useAuth();
  const visibleItems = sidebarNavigation.filter((item) =>
    item.roles.includes(currentUser?.role)
  );

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-30 bg-black/60 transition-opacity lg:hidden",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={onClose}
      />
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-sidebar transition-transform duration-200 lg:static lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="flex h-14 items-center justify-between px-4 border-b border-darkline">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded bg-brand-500 flex items-center justify-center">
              <span className="text-white text-xs font-bold">VB</span>
            </div>
            <span className="text-white font-semibold text-sm tracking-wide">VendorBridge</span>
          </div>
          <button
            className="lg:hidden text-gray-400 hover:text-white"
            onClick={onClose}
            type="button"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-0.5">
          {visibleItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-brand-600/20 text-brand-400 border-l-2 border-brand-500"
                      : "text-gray-400 hover:bg-white/5 hover:text-gray-200"
                  )
                }
                key={item.path}
                onClick={onClose}
                to={item.path}
              >
                <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* User footer */}
        <div className="border-t border-darkline p-3">
          <div className="flex items-center gap-3 rounded-lg px-2 py-2">
            <div className="h-8 w-8 rounded-full bg-brand-600 flex items-center justify-center shrink-0">
              <span className="text-white text-xs font-bold">
                {currentUser?.name?.charAt(0)?.toUpperCase() || "U"}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-gray-200 truncate">{currentUser?.name}</p>
              <p className="text-xs text-gray-500 truncate">
                {ROLE_LABELS[currentUser?.role] || "User"}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
