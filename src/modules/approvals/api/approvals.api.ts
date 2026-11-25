import type { ApprovalProfile } from "@/modules/approvals/types/approval.types";
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
};
