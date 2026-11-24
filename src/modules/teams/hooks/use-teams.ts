import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import type { LeagueProfile } from "@/modules/leagues/types/league.types";
import { teamsApi } from "@/modules/teams/api/teams.api";
import type { FantasyTeam, Franchise } from "@/modules/teams/types/team.types";
import type { Row } from "@/shared/types/common.types";
import { useRows } from "@/shared/hooks/use-rows";

export function useTeams(profileId: string) {
  const fetcher = useCallback(() => teamsApi.list(profileId), [profileId]);
  return useRows<FantasyTeam>(
    "fpl_teams",
    { profile_id: profileId, order: "sort_order.asc" },
    fetcher,
  );
}

export function useTeamFranchises() {
  return useRows<Franchise>("ipl_teams", {}, teamsApi.franchises);
}

export function useTeamProfile(profileId: string) {
  const fetcher = useCallback(() => teamsApi.profile(profileId), [profileId]);
  return useRows<LeagueProfile>("game_profiles", { id: profileId, limit: "1" }, fetcher);
}

export function useCreateTeam() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (row: Row) => teamsApi.create(row),
    onSuccess: () => queryClient.invalidateQueries(),
  });
}
