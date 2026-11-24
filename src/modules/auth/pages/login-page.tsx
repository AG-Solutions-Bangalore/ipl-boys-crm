import { useState, type FormEvent } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useSession } from "@/modules/auth/hooks/use-session";
import { BrandMark } from "@/shared/components/brand-mark";

export function LoginPage() {
  const { signIn, isAuthenticated, isAdmin, user } = useSession();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  if (isAuthenticated && user) {
    return <Navigate to={isAdmin ? "/overview" : "/unauthorized"} replace />;
  }

  const signInSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      await signIn(email.trim(), password);
      navigate("/overview", { replace: true });
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="login-shell">
      <form className="login-card" onSubmit={signInSubmit}>
        <BrandMark />
        <p className="eyebrow">FANTASY WORLD / ADMIN</p>
        <h1>Control room</h1>
        <p className="muted">Sign in with an approved administrator account.</p>
        {error && <p className="error-banner">{error}</p>}
        <label>
          Email address
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="username"
          />
        </label>
        <label>
          Password
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
        </label>
        <Button
          type="submit"
          size="lg"
          className="full h-auto py-2.5 text-[11px] font-bold"
          disabled={busy}
        >
          {busy ? "Signing in…" : "Sign in"}
        </Button>
      </form>
      <span className="login-foot">
        ADMIN ACCESS IS AUDITED · MYSQL IS ONLY ACCESSED THROUGH LARAVEL
      </span>
    </main>
  );
}
