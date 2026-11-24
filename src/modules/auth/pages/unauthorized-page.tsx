import { Navigate, useNavigate } from "react-router-dom";
import { useSession } from "@/modules/auth/hooks/use-session";
import { BrandMark } from "@/shared/components/brand-mark";

export function UnauthorizedPage() {
  const { signOut, isAuthenticated, isAdmin } = useSession();
  const navigate = useNavigate();

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (isAdmin) return <Navigate to="/overview" replace />;

  const handleSignOut = async () => {
    await signOut();
    navigate("/login", { replace: true });
  };

  return (
    <main className="login-shell">
      <section className="login-card">
        <BrandMark />
        <h1>Admin role required</h1>
        <p>
          Your signed-in account has no <code>app_admin</code> or <code>profile_admin</code> role.
        </p>
        <button className="primary" onClick={handleSignOut}>
          Sign out
        </button>
      </section>
    </main>
  );
}
