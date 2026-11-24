import type { LeagueProfile } from "@/modules/leagues/types/league.types";
import type { FantasyTeam, Franchise } from "@/modules/teams/types/team.types";
import { tableApi } from "@/shared/api/table.api";
import type { Row } from "@/shared/types/common.types";

export const teamsApi = {
  list: (profileId: string) =>
    tableApi.list<FantasyTeam>("fpl_teams", {
      profile_id: profileId,
      order: "sort_order.asc",
    }),
  franchises: () => tableApi.list<Franchise>("ipl_teams"),
  profile: (profileId: string) =>
    tableApi.list<LeagueProfile>("game_profiles", { id: profileId, limit: "1" }),
  create: (row: Row) => tableApi.insert("fpl_teams", row),
};
