import type { PlayerAssignment } from "@/modules/auction/types/auction.types";
import type { Player } from "@/modules/players/types/player.types";
import type { FantasyTeam } from "@/modules/teams/types/team.types";
import { tableApi } from "@/shared/api/table.api";

export const auctionApi = {
  teams: (profileId: string) =>
    tableApi.list<FantasyTeam>("fpl_teams", {
      profile_id: profileId,
      order: "sort_order.asc",
    }),
  players: () => tableApi.list<Player>("players", { order: "name.asc", limit: "1000" }),
  assignments: (profileId: string) =>
    tableApi.list<PlayerAssignment>("player_assignments", { profile_id: profileId }),
  sell: (profileId: string, teamId: string, playerId: string, price: number) =>
    tableApi.rpc("execute_auction_sale", {
      profile_id: profileId,
      team_id: teamId,
      player_id: playerId,
      price,
    }),
};
