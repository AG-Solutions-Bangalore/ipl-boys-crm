import { cn } from "cn";
import { LogOut, Menu, PanelLeftClose, PanelLeftOpen, X } from "lucide-react";
import { useEffect, useState, type CSSProperties } from "react";
import toast from "react-hot-toast";
import { NavLink } from "react-router-dom";
import { useSession } from "@/modules/auth/hooks/use-session";
import { navigation } from "@/modules/shell/config/navigation";
import type { NavigationSection } from "@/modules/shell/types/shell.types";
import { BrandMark } from "@/shared/components/brand-mark";

const SECTIONS: NavigationSection[] = ["Operations", "League & catalog"];

export function Sidebar({
  collapsed = false,
  onToggleCollapse,
}: {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}) {
  const { isAppAdmin, signOut } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [mobileOpen]);

  const visibleItems = navigation.filter((item) => !item.appAdminOnly || isAppAdmin);

  return (
    <aside className={cn("sidebar", mobileOpen && "is-open")} aria-label="Main navigation">
      <div className="sidebar-top-row">
        <div className="brand">
          <BrandMark />
          <div>
            <b>Fantasy World</b>
            <small>Admin console</small>
          </div>
        </div>

        {onToggleCollapse && (
          <button
            type="button"
            className="icon-button sidebar-collapse-btn"
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-expanded={!collapsed}
            onClick={onToggleCollapse}
          >
            {collapsed ? (
              <PanelLeftOpen size={16} strokeWidth={1.75} aria-hidden="true" />
            ) : (
              <PanelLeftClose size={16} strokeWidth={1.75} aria-hidden="true" />
            )}
          </button>
        )}

        <button
          type="button"
          className="icon-button mobile-menu-toggle"
          aria-expanded={mobileOpen}
          aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
          onClick={() => setMobileOpen((open) => !open)}
        >
          <Menu size={16} strokeWidth={1.75} aria-hidden="true" />
        </button>
      </div>

      <div
        className={cn("sidebar-backdrop", mobileOpen && "is-open")}
        aria-hidden="true"
        onClick={() => setMobileOpen(false)}
      />

      <div className="sidebar-nav-wrap">
        <div className="sidebar-drawer-head">
          <div className="brand">
            <BrandMark />
            <div>
              <b>Fantasy World</b>
              <small>Admin console</small>
            </div>
          </div>
          <button
            type="button"
            className="icon-button"
            aria-label="Close navigation menu"
            onClick={() => setMobileOpen(false)}
          >
            <X size={16} strokeWidth={1.75} aria-hidden="true" />
          </button>
        </div>

        {SECTIONS.map((section) => {
          const items = visibleItems.filter((item) => item.section === section);
          if (items.length === 0) return null;
          return (
            <div className="side-group" key={section}>
              <div className="side-label">{section}</div>
              <nav aria-label={section}>
                {items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      title={collapsed ? item.label : undefined}
                      onClick={() => setMobileOpen(false)}
                      style={{ "--nav-accent": item.accent } as CSSProperties}
                      className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}
                    >
                      {({ isActive }) => (
                        <>
                          <span className="nav-item-icon" aria-hidden="true">
                            <Icon size={17} strokeWidth={1.75} />
                          </span>
                          <span className="nav-item-label">{item.label}</span>
                          {isActive && <span className="nav-active-bar" aria-hidden="true" />}
                        </>
                      )}
                    </NavLink>
                  );
                })}
              </nav>
            </div>
          );
        })}

        <div className="sidebar-bottom">
          <button
            type="button"
            title={collapsed ? "Sign out" : undefined}
            className="nav-item sidebar-signout"
            onClick={() => {
              setMobileOpen(false);
              void signOut().then(() => toast.success("Signed out."));
            }}
          >
            <span className="nav-item-icon" aria-hidden="true">
              <LogOut size={17} strokeWidth={1.75} />
            </span>
            <span className="nav-item-label">Sign out</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
