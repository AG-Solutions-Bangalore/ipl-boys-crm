import { useEffect, useState, type FormEvent } from "react";
import { asText } from "@/lib/format";
import type { Gameweek } from "@/modules/gameweeks/types/gameweek.types";
import {
  useAdminBonusTeams,
  useAdminBonuses,
  useCreateAdminBonus,
} from "@/modules/scores/hooks/use-admin-bonuses";
import { useScoreGameweeks } from "@/modules/scores/hooks/use-scores";
import type { FantasyTeam } from "@/modules/teams/types/team.types";
import { DataTable } from "@/shared/components/data-table";
import { useAppFeedback } from "@/shared/context/feedback-context";

const getGameweekLabel = (week: Gameweek) => {
  const name = asText(week.name).trim();
  const id = String(week.id || "").trim();
  if (name) {
    return id ? `${name} (${id})` : name;
  }
  return id ? `No name (${id})` : "No name";
};

const getTeamLabel = (team: FantasyTeam) => {
  return asText(team.name).trim() || "Unnamed team";
};

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

  const resetForm = () => {
    setTeamId(teams.rows[0]?.id ? String(teams.rows[0].id) : "");
    setWeekId(gameweeks.rows[0]?.id ? String(gameweeks.rows[0].id) : "");
    setPoints("150");
    setNote("");
  };

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
          <select
            required
            value={teamId}
            onChange={(e) => setTeamId(e.target.value)}
            disabled={teams.loading || teams.rows.length === 0}
          >
            {teams.loading && <option value="">Loading teams…</option>}
            {!teams.loading && teams.rows.length === 0 && (
              <option value="" disabled>
                No fantasy teams in this league
              </option>
            )}
            {teams.rows.map((team) => (
              <option key={String(team.id)} value={String(team.id)}>
                {getTeamLabel(team)}
              </option>
            ))}
          </select>
        </label>
        <label>
          Gameweek
          <select required value={weekId} onChange={(e) => setWeekId(e.target.value)}>
            {gameweeks.rows.map((week) => (
              <option key={String(week.id)} value={String(week.id)}>
                {getGameweekLabel(week)}
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
          <button type="button" className="secondary" disabled={saving} onClick={resetForm}>
            Reset form
          </button>
        </div>
      </form>
      <div className="panel">
        <div className="panel-head">
          <h3>Recorded adjustments</h3>
        </div>
        <DataTable
          rows={bonuses.rows.map((row) => ({
            ...row,
            gameweek_label: (() => {
              const found = gameweeks.rows.find((w) => String(w.id) === String(row.gameweek_id));
              return found ? getGameweekLabel(found) : String(row.gameweek_id || "—");
            })(),
            team_name: (() => {
              const found = teams.rows.find((t) => String(t.id) === String(row.team_id));
              return found ? getTeamLabel(found) : String(row.team_id || "—");
            })(),
          }))}
          loading={bonuses.loading}
          columns={[
            { key: "gameweek_label", label: "Gameweek" },
            { key: "team_name", label: "Team" },
            { key: "points", label: "Points" },
            { key: "note", label: "Reason" },
          ]}
        />
      </div>
    </>
  );
}
