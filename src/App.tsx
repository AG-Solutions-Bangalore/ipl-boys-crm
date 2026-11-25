import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { AdminLayout } from "@/modules/shell/components/admin-layout";
import { AppAdminRoute } from "@/modules/shell/components/app-admin-route";
import { RequireAdmin } from "@/modules/shell/components/require-admin";

const ActivityPage = lazy(() =>
  import("@/modules/activity/pages/activity-page").then(({ ActivityPage }) => ({
    default: ActivityPage,
  })),
);
const ApprovalsPage = lazy(() =>
  import("@/modules/approvals/pages/approvals-page").then(({ ApprovalsPage }) => ({
    default: ApprovalsPage,
  })),
);
const AuctionPage = lazy(() =>
  import("@/modules/auction/pages/auction-page").then(({ AuctionPage }) => ({
    default: AuctionPage,
  })),
);
const LoginPage = lazy(() =>
  import("@/modules/auth/pages/login-page").then(({ LoginPage }) => ({ default: LoginPage })),
);
const UnauthorizedPage = lazy(() =>
  import("@/modules/auth/pages/unauthorized-page").then(({ UnauthorizedPage }) => ({
    default: UnauthorizedPage,
  })),
);
const GameweeksPage = lazy(() =>
  import("@/modules/gameweeks/pages/gameweeks-page").then(({ GameweeksPage }) => ({
    default: GameweeksPage,
  })),
);
const LeaguesPage = lazy(() =>
  import("@/modules/leagues/pages/leagues-page").then(({ LeaguesPage }) => ({
    default: LeaguesPage,
  })),
);
const ManagersPage = lazy(() =>
  import("@/modules/managers/pages/managers-page").then(({ ManagersPage }) => ({
    default: ManagersPage,
  })),
);
const OverviewPage = lazy(() =>
  import("@/modules/overview/pages/overview-page").then(({ OverviewPage }) => ({
    default: OverviewPage,
  })),
);
const PlayersPage = lazy(() =>
  import("@/modules/players/pages/players-page").then(({ PlayersPage }) => ({
    default: PlayersPage,
  })),
);
const ScoresPage = lazy(() =>
  import("@/modules/scores/pages/scores-page").then(({ ScoresPage }) => ({
    default: ScoresPage,
  })),
);
const TeamsPage = lazy(() =>
  import("@/modules/teams/pages/teams-page").then(({ TeamsPage }) => ({ default: TeamsPage })),
);
const TradesPage = lazy(() =>
  import("@/modules/trades/pages/trades-page").then(({ TradesPage }) => ({ default: TradesPage })),
);

export default function App() {
  return (
    <Suspense fallback={<div className="app-loading">Loading…</div>}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route element={<RequireAdmin />}>
          <Route element={<AdminLayout />}>
            <Route index element={<Navigate to="/overview" replace />} />
            <Route path="overview" element={<OverviewPage />} />
            <Route
              path="approvals"
              element={
                <AppAdminRoute>
                  <ApprovalsPage />
                </AppAdminRoute>
              }
            />
            <Route
              path="managers"
              element={
                <AppAdminRoute>
                  <ManagersPage />
                </AppAdminRoute>
              }
            />
            <Route path="leagues" element={<LeaguesPage />} />
            <Route path="teams" element={<TeamsPage />} />
            <Route path="players" element={<PlayersPage />} />
            <Route path="auction" element={<AuctionPage />} />
            <Route path="gameweeks" element={<GameweeksPage />} />
            <Route path="scores" element={<ScoresPage />} />
            <Route path="trades" element={<TradesPage />} />
            <Route path="activity" element={<ActivityPage />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}
