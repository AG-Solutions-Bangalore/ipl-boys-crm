import { useMutation, useQueryClient } from "@tanstack/react-query";
import { playersApi } from "@/modules/players/api/players.api";
import type { Player } from "@/modules/players/types/player.types";
import type { Franchise } from "@/modules/teams/types/team.types";
import type { Row } from "@/shared/types/common.types";
import { useRows } from "@/shared/hooks/use-rows";

export function usePlayers() {
  return useRows<Player>("players", { order: "name.asc", limit: "500" }, playersApi.list);
}

export function usePlayerFranchises() {
  return useRows<Franchise>("ipl_teams", { order: "name.asc" }, playersApi.franchises);
}

export function useCreatePlayer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (row: Row) => playersApi.create(row),
    onSuccess: () => queryClient.invalidateQueries(),
  });
}

export function useCreateFranchise() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (row: Row) => playersApi.createFranchise(row),
    onSuccess: () => queryClient.invalidateQueries(),
  });
}
