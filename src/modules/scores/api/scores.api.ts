import type { Gameweek } from "@/modules/gameweeks/types/gameweek.types";
import type { Player } from "@/modules/players/types/player.types";
import type {
  AdminBonus,
  PlayerMatchStats,
  TeamGameweekScore,
} from "@/modules/scores/types/score.types";
import type { FantasyTeam } from "@/modules/teams/types/team.types";
import { tableApi } from "@/shared/api/table.api";
import type { Row } from "@/shared/types/common.types";

export const scoresApi = {
  teamScores: (profileId: string) =>
    tableApi.list<TeamGameweekScore>("team_gw_scores", {
      profile_id: profileId,
      order: "points.desc",
      limit: "200",
    }),
  playerStats: (profileId: string) =>
    tableApi.list<PlayerMatchStats>("player_match_stats", {
      profile_id: profileId,
      order: "gameweek_id.desc",
      limit: "500",
    }),
  players: () => tableApi.list<Player>("players", { order: "name.asc", limit: "1000" }),
  gameweeks: () => tableApi.list<Gameweek>("gameweeks", { order: "number.asc" }),
  saveStats: (row: Row) => tableApi.insert("player_match_stats", row),
  adminBonuses: (profileId: string) =>
    tableApi.list<AdminBonus>("admin_bonuses", {
      profile_id: profileId,
      order: "created_at.desc",
      limit: "200",
    }),
  bonusTeams: (profileId: string) =>
    tableApi.list<FantasyTeam>("fpl_teams", { profile_id: profileId }),
  createBonus: (row: Row) => tableApi.insert("admin_bonuses", row),
};
