import { GrainGradient } from "@paper-design/shaders-react";
import { AlertCircle, ArrowRight, Eye, EyeOff, Gavel, Loader2, Swords, Trophy } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useSession } from "@/modules/auth/hooks/use-session";
import { BrandMark } from "@/shared/components/brand-mark";
import { usePrefersReducedMotion } from "@/shared/hooks/use-prefers-reduced-motion";

const mono = { fontFamily: '"DM Mono", monospace' } as const;

const fieldClass =
  "h-11 w-full rounded-lg border border-[#2a3034] bg-[#0c0f12] px-3.5 text-sm text-[#edf0e9] outline-none transition-[border-color,box-shadow,background-color] duration-150 hover:border-[#3a4145] focus:border-[#c79a4e] focus:bg-[#0e1115] focus:ring-2 focus:ring-[#e7b85c]/20";

const highlights = [
  {
    icon: Gavel,
    title: "Live auctions",
    copy: "Open lots, track purses, and close every sale.",
  },
  {
    icon: Swords,
    title: "Squads & trades",
    copy: "Approve exchanges and keep rosters compliant.",
  },
  {
    icon: Trophy,
    title: "Gameweek scoring",
    copy: "Set deadlines and recalculate points in a click.",
  },
] as const;

function ShaderPanel() {
  const reduceMotion = usePrefersReducedMotion();

  return (
    <section className="relative h-[36vh] min-h-[240px] overflow-hidden border-b border-[#252a2e] lg:h-auto lg:min-h-screen lg:border-b-0 lg:border-r">
      <div aria-hidden="true" className="absolute inset-0">
        <GrainGradient
          colors={["#c79a4e", "#3a2a10", "#0f2420", "#152433"]}
          colorBack="#090b0e"
          softness={0.5}
          intensity={0.5}
          noise={0.25}
          shape="corners"
          speed={reduceMotion ? 0 : 0.25}
          maxPixelCount={1920 * 1080}
          className="absolute inset-0 size-full"
        />
        <div className="absolute inset-0 bg-[#090b0e]/45" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(9,11,14,0.55)_0%,transparent_35%,transparent_65%,rgba(9,11,14,0.6)_100%)]" />
      </div>

      <div className="relative flex h-full flex-col justify-between gap-8 px-6 py-7 sm:px-10 lg:px-12 lg:py-10 xl:px-16">
        <header className="flex items-center gap-3">
          <BrandMark />
          <div>
            <b className="block font-heading text-[15px] font-semibold tracking-[0.08em]">
              FANTASY WORLD
            </b>
            <small className="mt-1 block text-[11px] text-[#a8aead]" style={mono}>
              Admin console
            </small>
          </div>
        </header>

        <div className="max-w-[480px]">
          <p
            className="m-0 text-[11px] uppercase tracking-[0.18em] text-[#d5ab63]"
            style={mono}
          >
            League operations
          </p>
          <h2 className="mt-3 font-heading text-[30px] font-medium leading-[1.05] tracking-[0.01em] text-[#f2f0ea] sm:text-[36px] lg:text-[46px]">
            Every bid, squad, and point in one room.
          </h2>
          <p className="mt-4 hidden max-w-[42ch] text-sm leading-6 text-[#b9bfba] lg:block">
            One audited console for auctions, trades, rosters, and gameweek scoring — built for
            the people running the league.
          </p>
          <ul className="mt-9 hidden list-none gap-5 p-0 lg:grid">
            {highlights.map(({ icon: Icon, title, copy }) => (
              <li key={title} className="flex items-start gap-3.5">
                <span className="mt-0.5 grid size-9 shrink-0 place-content-center rounded-lg border border-[#e7b85c]/25 bg-[#0b0e11]/60 text-[#e7b85c]">
                  <Icon size={16} strokeWidth={1.5} aria-hidden="true" />
                </span>
                <span>
                  <b className="block text-[13px] font-medium text-[#e9e8e3]">{title}</b>
                  <small className="mt-0.5 block text-xs leading-5 text-[#a8aead]">{copy}</small>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <p
          className="m-0 hidden text-[11px] uppercase tracking-[0.16em] text-[#838b8d] lg:block"
          style={mono}
        >
          Auction · Squads · Scoring
        </p>
      </div>
    </section>
  );
}

export function LoginPage() {
  const { signIn, isAuthenticated, isAdmin, user } = useSession();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
    <main className="min-h-screen bg-[#090b0e] text-[#e9e8e3] lg:grid lg:grid-cols-2">
      <ShaderPanel />

      <section className="flex min-h-[64vh] flex-col px-6 py-8 sm:px-10 lg:min-h-0 lg:px-14 lg:py-10 xl:px-16">
        <div className="flex flex-1 items-center justify-center py-12">
          <div className="w-full max-w-[372px]">
            <h1 className="font-heading text-[36px] font-medium leading-[1.08] tracking-[0.01em] sm:text-[40px]">
              League control room
            </h1>
            <p className="mt-3 max-w-[32ch] text-sm leading-6 text-[#a8aead]">
              Sign in to run auctions, squads, and gameweek scoring
            </p>

            <form className="mt-8 grid gap-4" onSubmit={signInSubmit}>
              {error && (
                <p className="error-banner m-0 flex items-start gap-2" role="alert">
                  <AlertCircle
                    size={16}
                    strokeWidth={1.5}
                    className="mt-px shrink-0"
                    aria-hidden="true"
                  />
                  {error}
                </p>
              )}
              <div className="grid gap-2">
                <label htmlFor="login-email" className="text-xs font-medium text-[#a8aead]">
                  Email address
                </label>
                <input
                  id="login-email"
                  type="email"
                  required
                  autoComplete="username"
                  autoCapitalize="none"
                  spellCheck={false}
                  className={fieldClass}
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="login-password" className="text-xs font-medium text-[#a8aead]">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    required
                    autoComplete="current-password"
                    className={`${fieldClass} pr-11`}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                  />
                  <button
                    type="button"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    aria-pressed={showPassword}
                    onClick={() => setShowPassword((visible) => !visible)}
                    className="absolute right-1.5 top-1/2 grid size-8 -translate-y-1/2 place-content-center rounded-md text-[#838b8d] transition-colors duration-150 hover:bg-[#161b1f] hover:text-[#e9e8e3] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e7b85c]"
                  >
                    {showPassword ? (
                      <EyeOff size={16} strokeWidth={1.5} aria-hidden="true" />
                    ) : (
                      <Eye size={16} strokeWidth={1.5} aria-hidden="true" />
                    )}
                  </button>
                </div>
              </div>
              <button
                type="submit"
                disabled={busy}
                aria-busy={busy}
                className="mt-2 inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#e7b85c] text-[13px] font-medium text-[#14120c] transition-[background-color,transform] duration-150 hover:bg-[#f0cb7b] active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e7b85c] focus-visible:ring-offset-2 focus-visible:ring-offset-[#090b0e] disabled:pointer-events-none"
              >
                {busy ? (
                  <Loader2 size={16} strokeWidth={1.5} className="animate-spin" aria-hidden="true" />
                ) : null}
                {busy ? "Signing in…" : "Sign in"}
                {busy ? null : <ArrowRight size={16} strokeWidth={1.5} aria-hidden="true" />}
              </button>
            </form>
          </div>
        </div>


      </section>
    </main>
  );
}
