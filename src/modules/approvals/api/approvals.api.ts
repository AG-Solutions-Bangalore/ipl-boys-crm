import { http } from "@/lib/axios";
import type { ApprovalProfile, LeagueLeadRequest } from "@/modules/approvals/types/approval.types";
import { tableApi } from "@/shared/api/table.api";

export const approvalsApi = {
  list: () =>
    tableApi.list<ApprovalProfile>("profiles", {
      approved: "0",
      "neq[status]": "rejected",
      limit: "200",
    }),
  decide: (id: string, approved: boolean) =>
    tableApi.update("profiles", id, {
      approved,
      status: approved ? "approved" : "rejected",
    }),
  listLeagueRequests: async (signal?: AbortSignal): Promise<LeagueLeadRequest[]> => {
    const { data } = await http.get<LeagueLeadRequest[]>("/league-requests", { signal });
    return data;
  },
  decideLeagueRequest: async (id: string, approve: boolean): Promise<{ success: boolean }> => {
    const { data } = await http.post<{ success: boolean }>(
      `/league-requests/${encodeURIComponent(id)}`,
      { approve },
    );
    return data;
  },
};
