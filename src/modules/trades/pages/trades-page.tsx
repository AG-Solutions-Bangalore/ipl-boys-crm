import { useState } from "react";
import { asText } from "@/lib/format";
import { useAdminContext } from "@/modules/shell/context/admin-context";
import { useCancelTrade, useExecuteTrade, useTrades } from "@/modules/trades/hooks/use-trades";
import type { Trade } from "@/modules/trades/types/trade.types";
import { DataTable } from "@/shared/components/data-table";
import { PanelTitle } from "@/shared/components/panel-title";
import { useAppFeedback } from "@/shared/context/feedback-context";

export function TradesPage() {
  const { profileId } = useAdminContext();
  const trades = useTrades(profileId);
  const executeTrade = useExecuteTrade();
  const cancelTrade = useCancelTrade();
  const { notify } = useAppFeedback();
  const [busy, setBusy] = useState("");

  const execute = async (row: Trade) => {
    if (!row.id) return;
    setBusy(String(row.id));
    try {
      await executeTrade.mutateAsync(String(row.id));
      trades.setRows((current) =>
        current.map((item) => (item.id === row.id ? { ...item, status: "accepted" } : item)),
      );
      notify("Trade accepted and processed.");
    } catch (err) {
      notify((err as Error).message);
    } finally {
      setBusy("");
    }
  };

  const cancel = async (row: Trade) => {
    if (!row.id) return;
    setBusy(String(row.id));
    try {
      await cancelTrade.mutateAsync(String(row.id));
      trades.setRows((current) =>
        current.map((item) => (item.id === row.id ? { ...item, status: "cancelled" } : item)),
      );
      notify("Pending trade cancelled.");
    } catch (err) {
      notify((err as Error).message);
    } finally {
      setBusy("");
    }
  };

  return (
    <>
      <PanelTitle
        eyebrow="Transfers & loans"
        title="Trade review"
        description="Accept valid pending exchanges or cancel an offer. Ownership, budget, roster, and weight checks are applied on the server."
      />
      <div className="panel">
        <DataTable
          rows={trades.rows}
          loading={trades.loading}
          columns={[
            { key: "created_at", label: "Created" },
            { key: "type", label: "Type" },
            { key: "from_team_id", label: "From team" },
            { key: "to_team_id", label: "To team" },
            { key: "status", label: "Status" },
            { key: "cash_from", label: "Cash from" },
            { key: "cash_to", label: "Cash to" },
          ]}
          actions={(row) =>
            asText(row.status) === "pending" ? (
              <div className="row-actions">
                <button
                  type="button"
                  className="primary small"
                  disabled={busy === row.id}
                  onClick={() => execute(row as Trade)}
                >
                  {busy === row.id ? "Working…" : "Accept"}
                </button>
                <button
                  type="button"
                  className="text-button"
                  disabled={busy === row.id}
                  onClick={() => cancel(row as Trade)}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <span className="muted">—</span>
            )
          }
        />
      </div>
    </>
  );
}
