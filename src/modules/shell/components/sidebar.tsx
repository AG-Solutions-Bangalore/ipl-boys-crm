import { LogOut } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useSession } from "@/modules/auth/hooks/use-session";
import { navigation } from "@/modules/shell/config/navigation";
import { BrandMark } from "@/shared/components/brand-mark";

export function Sidebar() {
  const { isAppAdmin, signOut } = useSession();
  return (
    <aside className="sidebar" aria-label="Main navigation">
      <div className="brand">
        <BrandMark />
        <div>
          <b>Fantasy World</b>
          <small>Admin console</small>
        </div>
      </div>
      <div className="side-label">Management</div>
      <nav>
        {navigation
          .filter((item) => !item.appAdminOnly || isAppAdmin)
          .map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}
              >
                <span
                  className="flex size-6 shrink-0 items-center justify-center rounded-md transition-transform duration-150"
                  style={{
                    color: item.color || "var(--text-secondary)",
                    backgroundColor: item.color ? `${item.color}22` : "rgba(255,255,255,0.04)",
                  }}
                >
                  <Icon size={14} strokeWidth={2} aria-hidden="true" />
                </span>
                <span>{item.label}</span>
                {item.path === "/approvals" && (
                  <span className="nav-dot" aria-label="Pending approvals" />
                )}
              </NavLink>
            );
          })}
      </nav>
      <div className="sidebar-bottom">
        <button className="nav-item" onClick={() => void signOut()}>
          <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-red-500/15 text-red-400">
            <LogOut size={14} strokeWidth={2} aria-hidden="true" />
          </span>
          <span>Sign out</span>
        </button>
      </div>
    </aside>
  );
}
