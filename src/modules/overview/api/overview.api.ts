import type { ApprovalProfile } from "@/modules/approvals/types/approval.types";
import type { Gameweek } from "@/modules/gameweeks/types/gameweek.types";
import type { FantasyTeam } from "@/modules/teams/types/team.types";
import type { Trade } from "@/modules/trades/types/trade.types";
import { tableApi } from "@/shared/api/table.api";

export const overviewApi = {
  teams: (profileId: string) => tableApi.list<FantasyTeam>("fpl_teams", { profile_id: profileId }),
  pendingProfiles: () =>
    tableApi.list<ApprovalProfile>("profiles", { approved: "0", limit: "100" }),
  gameweeks: () => tableApi.list<Gameweek>("gameweeks", { order: "number.asc" }),
  pendingTrades: (profileId: string) =>
    tableApi.list<Trade>("trades", {
      profile_id: profileId,
      status: "pending",
      limit: "100",
    }),
};
