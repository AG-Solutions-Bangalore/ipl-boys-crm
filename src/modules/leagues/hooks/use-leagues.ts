import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { leaguesApi } from "@/modules/leagues/api/leagues.api";
import type { Row } from "@/shared/types/common.types";

export function useLeagueProfiles(enabled = true) {
  return useQuery({
    queryKey: queryKeys.profiles,
    queryFn: leaguesApi.listProfiles,
    enabled,
  });
}

export function useCreateLeague() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (row: Row) => leaguesApi.create(row),
    onSuccess: () => queryClient.invalidateQueries(),
  });
}

export function useUpdateLeague() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, row }: { id: string; row: Row }) => leaguesApi.update(id, row),
    onSuccess: () => queryClient.invalidateQueries(),
  });
}
