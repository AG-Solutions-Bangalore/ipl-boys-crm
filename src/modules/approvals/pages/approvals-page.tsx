import { Ban, Check } from "lucide-react";
import { useState } from "react";
import {
  useDecideApproval,
  useDecideLeagueRequest,
  useLeagueLeadRequests,
  usePendingApprovals,
} from "@/modules/approvals/hooks/use-approvals";
import type { ApprovalProfile } from "@/modules/approvals/types/approval.types";
import { DataTable } from "@/shared/components/data-table";
import { PanelTitle } from "@/shared/components/panel-title";
import { useAppFeedback } from "@/shared/context/feedback-context";

function LeagueLeadApprovals() {
  const { rows, loading, error, setRows } = useLeagueLeadRequests();
  const decideLeagueRequest = useDecideLeagueRequest();
  const { notify, showError } = useAppFeedback();
  const [working, setWorking] = useState<string | null>(null);

  const decide = async (id: string, approve: boolean) => {
    if (!id) return;
    setWorking(id);
    try {
      await decideLeagueRequest.mutateAsync({ id, approve });
      setRows((current) => current.filter((item) => String(item.id) !== id));
      notify(
        approve ? "League created and lead account approved." : "League lead request rejected.",
      );
    } catch (err) {
      showError((err as Error).message);
    } finally {
      setWorking(null);
    }
  };

  return (
    <div className="panel">
      <PanelTitle
        eyebrow="Access control"
        title="League Lead approvals"
        description="Review new league requests submitted through the Flutter app."
      />
      {error && (
        <p className="error-banner mb-4" role="alert">
          {error}
        </p>
      )}
      <DataTable
        rows={rows}
        loading={loading}
        empty={error ? "Unable to load league requests" : "No pending league requests"}
        columns={[
          { key: "league_name", label: "Requested league" },
          { key: "display_name", label: "Applicant" },
        ]}
        actions={(row) => (
          <div className="row-actions">
            <button
              type="button"
              className="icon-button approve"
              aria-label={`Approve league request ${String(row.league_name || row.display_name || "")}`.trim()}
              title="Approve"
              disabled={working !== null}
              onClick={() => void decide(String(row.id || ""), true)}
            >
              <Check size={16} strokeWidth={1.75} />
            </button>
            <button
              type="button"
              className="icon-button deny"
              aria-label={`Reject league request ${String(row.league_name || row.display_name || "")}`.trim()}
              title="Reject"
              disabled={working !== null}
              onClick={() => void decide(String(row.id || ""), false)}
            >
              <Ban size={16} strokeWidth={1.75} />
            </button>
          </div>
        )}
      />
    </div>
  );
}

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
      <LeagueLeadApprovals />
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
