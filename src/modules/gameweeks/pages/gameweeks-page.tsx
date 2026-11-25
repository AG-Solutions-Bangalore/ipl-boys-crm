import { Plus, Shield } from "lucide-react";
import { useState } from "react";
import { asText, isTrue } from "@/lib/format";
import { useSession } from "@/modules/auth/hooks/use-session";
import { CreateGameweekForm } from "@/modules/gameweeks/components/create-gameweek-form";
import {
  useGameweeks,
  useRecalculateGameweek,
  useSetActiveGameweek,
  useUpdateGameweek,
} from "@/modules/gameweeks/hooks/use-gameweeks";
import type { Gameweek } from "@/modules/gameweeks/types/gameweek.types";
import { useAdminContext } from "@/modules/shell/context/admin-context";
import { DataTable } from "@/shared/components/data-table";
import { PanelTitle } from "@/shared/components/panel-title";
import { useAppFeedback } from "@/shared/context/feedback-context";
import type { Row } from "@/shared/types/common.types";

export function GameweeksPage() {
  const { profileId } = useAdminContext();
  const { isAppAdmin } = useSession();
  const gameweeks = useGameweeks();
  const updateGameweek = useUpdateGameweek();
  const setActiveGameweek = useSetActiveGameweek();
  const recalculateGameweek = useRecalculateGameweek();
  const { notify } = useAppFeedback();
  const [busy, setBusy] = useState("");
  const [adding, setAdding] = useState(false);
  const nextNumber = Math.max(0, ...gameweeks.rows.map((row) => Number(row.number) || 0)) + 1;

  const update = async (row: Gameweek, patch: Row) => {
    if (!row.id) return;
    setBusy(String(row.id));
    try {
      await updateGameweek.mutateAsync({ id: String(row.id), row: patch });
      notify("Gameweek updated.");
    } catch (err) {
      notify((err as Error).message);
    } finally {
      setBusy("");
    }
  };

  const recalc = async (row: Gameweek) => {
    if (!row.id) return;
    setBusy(`score-${row.id}`);
    try {
      await recalculateGameweek.mutateAsync({
        profileId,
        gameweekId: String(row.id),
      });
      notify(`Scores recalculated for ${asText(row.name)}.`);
    } catch (err) {
      notify((err as Error).message);
    } finally {
      setBusy("");
    }
  };

  const setActive = async (row: Gameweek) => {
    if (!row.id) return;
    setBusy(String(row.id));
    try {
      await setActiveGameweek.mutateAsync(String(row.id));
      notify(`${asText(row.name)} is active.`);
    } catch (err) {
      notify((err as Error).message);
    } finally {
      setBusy("");
    }
  };

  return (
    <>
      <PanelTitle
        eyebrow="Schedule & deadlines"
        title="Gameweeks"
        description="Set the active week and deadline. Deadline locks snapshot every team's submitted lineup."
        actions={
          isAppAdmin && (
            <button type="button" className="primary" onClick={() => setAdding((value) => !value)}>
              <Plus size={14} strokeWidth={1.75} /> Add gameweek
            </button>
          )
        }
      />
      {adding && <CreateGameweekForm nextNumber={nextNumber} onClose={() => setAdding(false)} />}
      <div className="panel">
        <DataTable
          rows={gameweeks.rows}
          loading={gameweeks.loading}
          columns={[
            { key: "number", label: "Week" },
            { key: "name", label: "Name" },
            { key: "deadline", label: "Deadline" },
            { key: "is_active", label: "Active" },
            { key: "is_locked", label: "Locked" },
          ]}
          actions={(row) => (
            <div className="row-actions">
              {isAppAdmin && (
                <button
                  type="button"
                  className="text-button"
                  disabled={busy === row.id || isTrue(row.is_locked)}
                  onClick={() => setActive(row as Gameweek)}
                >
                  Set active
                </button>
              )}
              <button
                type="button"
                className="text-button"
                disabled={busy === `score-${row.id}`}
                onClick={() => recalc(row as Gameweek)}
              >
                {busy === `score-${row.id}` ? "Working…" : "Recalculate"}
              </button>
              {isAppAdmin && (
                <button
                  type="button"
                  className="text-button"
                  disabled={busy === row.id || !isTrue(row.is_locked)}
                  onClick={() =>
                    update(row as Gameweek, {
                      is_locked: false,
                      admin_override_unlocked: true,
                    })
                  }
                >
                  Unlock
                </button>
              )}
            </div>
          )}
        />
      </div>
      <p className="hint">
        <Shield size={15} /> Each deadline lock snapshots the current submitted lineup and preserves
        a backup.
      </p>
    </>
  );
}
