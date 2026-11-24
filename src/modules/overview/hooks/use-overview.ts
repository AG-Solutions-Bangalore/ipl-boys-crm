import { useCallback } from "react";
import type { ApprovalProfile } from "@/modules/approvals/types/approval.types";
import type { Gameweek } from "@/modules/gameweeks/types/gameweek.types";
import { overviewApi } from "@/modules/overview/api/overview.api";
import type { FantasyTeam } from "@/modules/teams/types/team.types";
import type { Trade } from "@/modules/trades/types/trade.types";
import { useRows } from "@/shared/hooks/use-rows";

export function useOverviewData(profileId: string) {
  const teamsFetcher = useCallback(() => overviewApi.teams(profileId), [profileId]);
  const tradesFetcher = useCallback(() => overviewApi.pendingTrades(profileId), [profileId]);

  const teams = useRows<FantasyTeam>("fpl_teams", { profile_id: profileId }, teamsFetcher);
  const pending = useRows<ApprovalProfile>(
    "profiles",
    { approved: "0", limit: "100" },
    overviewApi.pendingProfiles,
  );
  const weeks = useRows<Gameweek>("gameweeks", { order: "number.asc" }, overviewApi.gameweeks);
  const trades = useRows<Trade>(
    "trades",
    { profile_id: profileId, status: "pending", limit: "100" },
    tradesFetcher,
  );

  return { teams, pending, weeks, trades };
}
