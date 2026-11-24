import { useMutation, useQueryClient } from "@tanstack/react-query";
import { approvalsApi } from "@/modules/approvals/api/approvals.api";
import type { ApprovalProfile } from "@/modules/approvals/types/approval.types";
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
