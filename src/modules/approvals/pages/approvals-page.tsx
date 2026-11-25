import { Ban, Check } from "lucide-react";
import { useState } from "react";
import { useDecideApproval, usePendingApprovals } from "@/modules/approvals/hooks/use-approvals";
import type { ApprovalProfile } from "@/modules/approvals/types/approval.types";
import { DataTable } from "@/shared/components/data-table";
import { PanelTitle } from "@/shared/components/panel-title";
import { useAppFeedback } from "@/shared/context/feedback-context";

export function ApprovalsPage() {
  const { rows, loading, error, setRows } = usePendingApprovals();
  const decideApproval = useDecideApproval();
  const { notify, showError } = useAppFeedback();
  const [working, setWorking] = useState("");

  const decide = async (row: ApprovalProfile, approved: boolean) => {
    if (!row.id) return;
    setWorking(String(row.id));
    try {
      await decideApproval.mutateAsync({ id: String(row.id), approved });
      setRows((current) => current.filter((item) => item.id !== row.id));
      notify(approved ? "Account approved." : "Account access denied.");
    } catch (err) {
      showError((err as Error).message);
    } finally {
      setWorking("");
    }
  };

  return (
    <>
      <PanelTitle
        eyebrow="Access control"
        title="Account approvals"
        description="New manager accounts remain pending until an administrator approves them."
      />
      <div className="panel">
        <div className="panel-head">
          <h3>
            Waiting for approval <span className="count-pill">{rows.length}</span>
          </h3>
          <span className="mini-tag">{error || "Approval required"}</span>
        </div>
        <DataTable
          rows={rows}
          loading={loading}
          columns={[
            { key: "display_name", label: "Manager" },
            { key: "email", label: "Email" },
            { key: "created_at", label: "Requested" },
          ]}
          actions={(row) => (
            <div className="row-actions">
              <button
                type="button"
                className="icon-button approve"
                disabled={working === row.id}
                title="Approve account"
                aria-label={`Approve ${String(row.display_name || row.email || "manager")}`}
                onClick={() => decide(row, true)}
              >
                <Check size={16} strokeWidth={1.75} />
              </button>
              <button
                type="button"
                className="icon-button deny"
                disabled={working === row.id}
                title="Deny account"
                aria-label={`Deny ${String(row.display_name || row.email || "manager")}`}
                onClick={() => decide(row, false)}
              >
                <Ban size={16} strokeWidth={1.75} />
              </button>
            </div>
          )}
        />
      </div>
    </>
  );
}
