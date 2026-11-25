import { useEffect, useState, type FormEvent } from "react";
import { asText } from "@/lib/format";
import {
  useAdminBonusTeams,
  useAdminBonuses,
  useCreateAdminBonus,
} from "@/modules/scores/hooks/use-admin-bonuses";
import { useScoreGameweeks } from "@/modules/scores/hooks/use-scores";
import { DataTable } from "@/shared/components/data-table";
import { useAppFeedback } from "@/shared/context/feedback-context";

export function AdminBonusManager({ profileId }: { profileId: string }) {
  const bonuses = useAdminBonuses(profileId);
  const teams = useAdminBonusTeams(profileId);
  const gameweeks = useScoreGameweeks();
  const createBonus = useCreateAdminBonus();
  const { notify, showError } = useAppFeedback();
  const [teamId, setTeamId] = useState("");
  const [weekId, setWeekId] = useState("");
  const [points, setPoints] = useState("150");
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!teamId && teams.rows[0]?.id) setTeamId(String(teams.rows[0].id));
    if (!weekId && gameweeks.rows[0]?.id) setWeekId(String(gameweeks.rows[0].id));
  }, [teamId, weekId, teams.rows, gameweeks.rows]);

  const add = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    try {
      await createBonus.mutateAsync({
        id: crypto.randomUUID(),
        profile_id: profileId,
        team_id: teamId,
        gameweek_id: weekId,
        points: Number(points),
        note,
        created_at: new Date().toISOString(),
      });
      setNote("");
      notify("Point adjustment recorded. Recalculate the gameweek to include it.");
    } catch (err) {
      showError(`Could not record adjustment: ${(err as Error).message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <form className="panel add-form" onSubmit={add}>
        <div className="form-head">
          <h3>Record an admin point adjustment</h3>
          <p className="muted">
            Use for documented league adjustments and Straddle outcomes (usually +150 or −150).
          </p>
        </div>
        <label>
          Fantasy team
          <select required value={teamId} onChange={(e) => setTeamId(e.target.value)}>
            {teams.rows.map((team) => (
              <option key={String(team.id)} value={String(team.id)}>
                {asText(team.name)}
              </option>
            ))}
          </select>
        </label>
        <label>
          Gameweek
          <select required value={weekId} onChange={(e) => setWeekId(e.target.value)}>
            {gameweeks.rows.map((week) => (
              <option key={String(week.id)} value={String(week.id)}>
                {asText(week.name)}
              </option>
            ))}
          </select>
        </label>
        <label>
          Points (positive or negative)
          <input
            required
            type="number"
            value={points}
            onChange={(e) => setPoints(e.target.value)}
          />
        </label>
        <label>
          Reason
          <input required value={note} onChange={(e) => setNote(e.target.value)} />
        </label>
        <div className="add-form-actions">
          <button type="submit" className="primary" disabled={saving || !teamId || !weekId}>
            {saving ? "Saving…" : "Record adjustment"}
          </button>
        </div>
      </form>
      <div className="panel">
        <div className="panel-head">
          <h3>Recorded adjustments</h3>
        </div>
        <DataTable
          rows={bonuses.rows}
          loading={bonuses.loading}
          columns={[
            { key: "gameweek_id", label: "Gameweek" },
            { key: "team_id", label: "Team ID" },
            { key: "points", label: "Points" },
            { key: "note", label: "Reason" },
          ]}
        />
      </div>
    </>
  );
}
