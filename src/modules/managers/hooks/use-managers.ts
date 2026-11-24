import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { managersApi } from "@/modules/managers/api/managers.api";
import type { ManagerAssignment, ManagerProfile } from "@/modules/managers/types/manager.types";
import type { FantasyTeam } from "@/modules/teams/types/team.types";
import { useRows } from "@/shared/hooks/use-rows";

export function useManagerProfiles() {
  return useRows<ManagerProfile>("profiles", { limit: "500" }, managersApi.listProfiles);
}

export function useManagerTeams(profileId: string) {
  const fetcher = useCallback(() => managersApi.listTeams(profileId), [profileId]);
  return useRows<FantasyTeam>(
    "fpl_teams",
    { profile_id: profileId, order: "sort_order.asc" },
    fetcher,
  );
}

export function useManagerAssignments(profileId: string) {
  const fetcher = useCallback(() => managersApi.listAssignments(profileId), [profileId]);
  return useRows<ManagerAssignment>(
    "user_team_assignments",
    { profile_id: profileId, limit: "500" },
    fetcher,
  );
}

export function useAssignManager() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      userId,
      profileId,
      teamId,
    }: {
      userId: string;
      profileId: string;
      teamId: string;
    }) => managersApi.assign(userId, profileId, teamId),
    onSuccess: () => queryClient.invalidateQueries(),
  });
}

export function useRemoveAssignment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => managersApi.removeAssignment(id),
    onSuccess: () => queryClient.invalidateQueries(),
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: ({ userId, password }: { userId: string; password: string }) =>
      managersApi.resetPassword(userId, password),
  });
}
