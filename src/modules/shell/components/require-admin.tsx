import { Navigate, Outlet } from "react-router-dom";
import { useSession } from "@/modules/auth/hooks/use-session";

export function RequireAdmin() {
  const { loading, isAuthenticated, isAdmin } = useSession();

  if (loading) {
    return (
      <main className="login-shell">
        <section className="login-card">
          <h1>Loading…</h1>
        </section>
      </main>
    );
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/unauthorized" replace />;
  return <Outlet />;
}
