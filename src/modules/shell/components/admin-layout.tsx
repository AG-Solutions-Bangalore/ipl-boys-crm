import { Outlet } from "react-router-dom";
import { AdminProvider, useAdminContext } from "@/modules/shell/context/admin-context";
import { Sidebar } from "@/modules/shell/components/sidebar";
import { Topbar } from "@/modules/shell/components/topbar";
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
  return (
    <div className="app-shell">
      <Sidebar />
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
