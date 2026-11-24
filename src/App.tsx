import { Navigate, Route, Routes } from "react-router-dom";
import { ActivityPage } from "@/modules/activity/pages/activity-page";
import { ApprovalsPage } from "@/modules/approvals/pages/approvals-page";
import { AuctionPage } from "@/modules/auction/pages/auction-page";
import { LoginPage } from "@/modules/auth/pages/login-page";
import { UnauthorizedPage } from "@/modules/auth/pages/unauthorized-page";
import { GameweeksPage } from "@/modules/gameweeks/pages/gameweeks-page";
import { LeaguesPage } from "@/modules/leagues/pages/leagues-page";
import { ManagersPage } from "@/modules/managers/pages/managers-page";
import { OverviewPage } from "@/modules/overview/pages/overview-page";
import { PlayersPage } from "@/modules/players/pages/players-page";
import { ScoresPage } from "@/modules/scores/pages/scores-page";
import { AdminLayout } from "@/modules/shell/components/admin-layout";
import { AppAdminRoute } from "@/modules/shell/components/app-admin-route";
import { RequireAdmin } from "@/modules/shell/components/require-admin";
import { TeamsPage } from "@/modules/teams/pages/teams-page";
import { TradesPage } from "@/modules/trades/pages/trades-page";

export default function App() {
  return (
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
  );
}
