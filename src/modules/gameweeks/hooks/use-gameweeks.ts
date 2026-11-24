import { useMutation, useQueryClient } from "@tanstack/react-query";
import { gameweeksApi } from "@/modules/gameweeks/api/gameweeks.api";
import type { Gameweek } from "@/modules/gameweeks/types/gameweek.types";
import type { Row } from "@/shared/types/common.types";
import { useRows } from "@/shared/hooks/use-rows";

export function useGameweeks() {
  return useRows<Gameweek>("gameweeks", { order: "number.asc" }, gameweeksApi.list);
}

export function useCreateGameweek() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (row: Row) => gameweeksApi.create(row),
    onSuccess: () => queryClient.invalidateQueries(),
  });
}

export function useUpdateGameweek() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, row }: { id: string; row: Row }) => gameweeksApi.update(id, row),
    onSuccess: () => queryClient.invalidateQueries(),
  });
}

export function useSetActiveGameweek() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (gameweekId: string) => gameweeksApi.setActive(gameweekId),
    onSuccess: () => queryClient.invalidateQueries(),
  });
}

export function useRecalculateGameweek() {
  return useMutation({
    mutationFn: ({ profileId, gameweekId }: { profileId: string; gameweekId: string }) =>
      gameweeksApi.recalculate(profileId, gameweekId),
  });
}
