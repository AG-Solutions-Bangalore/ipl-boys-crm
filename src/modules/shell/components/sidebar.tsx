import { LogOut } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useSession } from "@/modules/auth/hooks/use-session";
import { navigation } from "@/modules/shell/config/navigation";
import { BrandMark } from "@/shared/components/brand-mark";

export function Sidebar() {
  const { isAppAdmin, signOut } = useSession();
  return (
    <aside className="sidebar">
      <div className="brand">
        <BrandMark />
        <div>
          <b>FANTASY WORLD</b>
          <small>ADMIN CONSOLE</small>
        </div>
      </div>
      <div className="side-label">MANAGEMENT</div>
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
                <Icon size={17} />
                {item.label}
                {item.path === "/approvals" && <span className="nav-dot" />}
              </NavLink>
            );
          })}
      </nav>
      <div className="sidebar-bottom">
        <div className="secure-note">
          <span className="online-dot" />
          Laravel API connected
        </div>
        <button className="nav-item" onClick={() => void signOut()}>
          <LogOut size={17} />
          Sign out
        </button>
      </div>
    </aside>
  );
}
