import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import type { Gameweek } from "@/modules/gameweeks/types/gameweek.types";
import type { Player } from "@/modules/players/types/player.types";
import { scoresApi } from "@/modules/scores/api/scores.api";
import type { PlayerMatchStats, TeamGameweekScore } from "@/modules/scores/types/score.types";
import type { Row } from "@/shared/types/common.types";
import { useRows } from "@/shared/hooks/use-rows";

export function useTeamScores(profileId: string) {
  const fetcher = useCallback(() => scoresApi.teamScores(profileId), [profileId]);
  return useRows<TeamGameweekScore>(
    "team_gw_scores",
    { profile_id: profileId, order: "points.desc", limit: "200" },
    fetcher,
  );
}

export function usePlayerMatchStats(profileId: string) {
  const fetcher = useCallback(() => scoresApi.playerStats(profileId), [profileId]);
  return useRows<PlayerMatchStats>(
    "player_match_stats",
    { profile_id: profileId, order: "gameweek_id.desc", limit: "500" },
    fetcher,
  );
}

export function useScorePlayers() {
  return useRows<Player>("players", { order: "name.asc", limit: "1000" }, scoresApi.players);
}

export function useScoreGameweeks() {
  return useRows<Gameweek>("gameweeks", { order: "number.asc" }, scoresApi.gameweeks);
}

export function useSaveMatchStats() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (row: Row) => scoresApi.saveStats(row),
    onSuccess: () => queryClient.invalidateQueries(),
  });
}
