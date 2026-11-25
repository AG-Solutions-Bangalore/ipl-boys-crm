import { cn } from "cn";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "@/modules/shell/components/sidebar";
import { Topbar } from "@/modules/shell/components/topbar";
import { AdminProvider, useAdminContext } from "@/modules/shell/context/admin-context";
import { FeedbackBanners } from "@/shared/components/feedback-banners";
import { FeedbackProvider } from "@/shared/context/feedback-context";

export function AdminLayout() {
  return (
    <FeedbackProvider>
      <AdminProvider>
        <AdminShell />
      </AdminProvider>
    </FeedbackProvider>
  );
}

function AdminShell() {
  const { profileId } = useAdminContext();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={cn("app-shell", collapsed && "is-collapsed")}>
      <Sidebar collapsed={collapsed} onToggleCollapse={() => setCollapsed((c) => !c)} />
      <main className="main-panel">
        <Topbar />
        <FeedbackBanners />
        <section className="content" key={profileId}>
          <Outlet />
        </section>
      </main>
    </div>
  );
}
