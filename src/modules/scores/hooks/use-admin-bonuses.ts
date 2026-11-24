import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { scoresApi } from "@/modules/scores/api/scores.api";
import type { AdminBonus } from "@/modules/scores/types/score.types";
import type { FantasyTeam } from "@/modules/teams/types/team.types";
import type { Row } from "@/shared/types/common.types";
import { useRows } from "@/shared/hooks/use-rows";

export function useAdminBonuses(profileId: string) {
  const fetcher = useCallback(() => scoresApi.adminBonuses(profileId), [profileId]);
  return useRows<AdminBonus>(
    "admin_bonuses",
    { profile_id: profileId, order: "created_at.desc", limit: "200" },
    fetcher,
  );
}

export function useAdminBonusTeams(profileId: string) {
  const fetcher = useCallback(() => scoresApi.bonusTeams(profileId), [profileId]);
  return useRows<FantasyTeam>("fpl_teams", { profile_id: profileId }, fetcher);
}

export function useCreateAdminBonus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (row: Row) => scoresApi.createBonus(row),
    onSuccess: () => queryClient.invalidateQueries(),
  });
}
