import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";
import { queryKeys } from "@/lib/query-keys";
import { approvalsApi } from "@/modules/approvals/api/approvals.api";
import type { ApprovalProfile, LeagueLeadRequest } from "@/modules/approvals/types/approval.types";
import { useRows } from "@/shared/hooks/use-rows";

export function usePendingApprovals() {
  return useRows<ApprovalProfile>(
    "profiles",
    { approved: "0", "neq[status]": "rejected", limit: "200" },
    approvalsApi.list,
  );
}

export function useDecideApproval() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, approved }: { id: string; approved: boolean }) =>
      approvalsApi.decide(id, approved),
    onSuccess: () => queryClient.invalidateQueries(),
  });
}

export function useLeagueLeadRequests() {
  const queryClient = useQueryClient();
  const queryKey = useMemo(() => queryKeys.rows("league-requests", {}), []);
  const query = useQuery({
    queryKey,
    queryFn: ({ signal }) => approvalsApi.listLeagueRequests(signal),
    placeholderData: (previous) => previous,
  });
  const setRows = useCallback(
    (updater: LeagueLeadRequest[] | ((rows: LeagueLeadRequest[]) => LeagueLeadRequest[])) => {
      queryClient.setQueryData<LeagueLeadRequest[]>(queryKey, (current = []) =>
        typeof updater === "function"
          ? (updater as (rows: LeagueLeadRequest[]) => LeagueLeadRequest[])(current)
          : updater,
      );
    },
    [queryClient, queryKey],
  );
  return {
    rows: query.data ?? [],
    loading: query.isLoading,
    error: query.error instanceof Error ? query.error.message : "",
    setRows,
  };
}

export function useDecideLeagueRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, approve }: { id: string; approve: boolean }) =>
      approvalsApi.decideLeagueRequest(id, approve),
    onSuccess: () => queryClient.invalidateQueries(),
  });
}
