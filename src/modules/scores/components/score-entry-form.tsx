import { useEffect, useState, type FormEvent } from "react";
import { asText } from "@/lib/format";
import type { Gameweek } from "@/modules/gameweeks/types/gameweek.types";
import type { Player } from "@/modules/players/types/player.types";
import { useSaveMatchStats } from "@/modules/scores/hooks/use-scores";
import type { MatchFlags, MatchStatValues } from "@/modules/scores/types/score.types";
import { useAppFeedback } from "@/shared/context/feedback-context";

const getGameweekLabel = (week: Gameweek) => {
  const name = asText(week.name).trim();
  const id = String(week.id || "").trim();
  if (name) {
    return id ? `${name} (${id})` : name;
  }
  return id ? `No name (${id})` : "No name";
};

const defaultValues: MatchStatValues = {
  runs: "0",
  balls: "0",
  wickets: "0",
  overs_bowled: "0",
  runs_conceded: "0",
  maidens: "0",
  catches: "0",
  stumpings: "0",
  run_outs: "0",
  direct_run_outs: "0",
  split_run_outs: "0",
  fours: "0",
  sixes: "0",
  hat_tricks: "0",
};

const STAT_LABELS: Record<keyof MatchStatValues, string> = {
  runs: "Runs scored",
  balls: "Balls faced",
  wickets: "Wickets",
  overs_bowled: "Overs bowled",
  runs_conceded: "Runs conceded",
  maidens: "Maiden overs",
  catches: "Catches",
  stumpings: "Stumpings",
  run_outs: "Run outs",
  direct_run_outs: "Direct run outs",
  split_run_outs: "Split run outs",
  fours: "Fours",
  sixes: "Sixes",
  hat_tricks: "Hat-tricks",
};

const defaultFlags: MatchFlags = {
  is_out: true,
  is_dnp: false,
  team_win: false,
  motm: false,
  six_sixes: false,
  super_over: false,
};

const FLAG_LABELS: Record<keyof MatchFlags, string> = {
  is_out: "Dismissed (out)",
  is_dnp: "Did not play (DNP)",
  team_win: "Winning side",
  motm: "Player of the match",
  six_sixes: "Six sixes in an over",
  super_over: "Super over played",
};

export function ScoreEntryForm({
  profileId,
  gameweeks,
  players,
}: {
  profileId: string;
  gameweeks: Gameweek[];
  players: Player[];
}) {
  const saveStats = useSaveMatchStats();
  const { notify, showError } = useAppFeedback();
  const [gameweekId, setGameweekId] = useState("");
  const [playerId, setPlayerId] = useState("");
  const [matchNumber, setMatchNumber] = useState("1");
  const [values, setValues] = useState<MatchStatValues>(defaultValues);
  const [flags, setFlags] = useState<MatchFlags>(defaultFlags);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!gameweekId && gameweeks[0]?.id) setGameweekId(String(gameweeks[0].id));
    if (!playerId && players[0]?.id) setPlayerId(String(players[0].id));
  }, [gameweekId, playerId, gameweeks, players]);

  const resetForm = () => {
    setGameweekId(gameweeks[0]?.id ? String(gameweeks[0].id) : "");
    setPlayerId(players[0]?.id ? String(players[0].id) : "");
    setMatchNumber("1");
    setValues(defaultValues);
    setFlags(defaultFlags);
  };

  const addStats = async (event: FormEvent) => {
    event.preventDefault();
    if (!profileId || !gameweekId || !playerId) return;
    setSaving(true);
    try {
      await saveStats.mutateAsync({
        id: crypto.randomUUID(),
        profile_id: profileId,
        gameweek_id: gameweekId,
        player_id: playerId,
        match_number: Number(matchNumber) || 1,
        ...Object.fromEntries(
          Object.entries(values).map(([key, value]) => [key, Number(value) || 0]),
        ),
        ...flags,
        participation_type: flags.is_dnp ? "not_played" : "played",
        created_at: new Date().toISOString(),
      });
      notify(
        "Player match stats saved. Recalculate the gameweek after entering all match results.",
      );
    } catch (err) {
      showError(`Could not save match stats: ${(err as Error).message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="panel" onSubmit={addStats}>
      <div className="panel-head">
        <div>
          <p className="eyebrow">Match scoring</p>
          <h3>Enter player match line</h3>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-3.5 md:grid-cols-3">
        <label className="flex flex-col gap-1.5 text-xs font-medium text-[var(--text-secondary)]">
          Gameweek
          <select
            required
            value={gameweekId}
            onChange={(e) => setGameweekId(e.target.value)}
            className="h-9 rounded-lg border border-input bg-[var(--surface2)] px-3 text-sm text-[var(--text-primary)] outline-none focus:border-ring"
          >
            {gameweeks.map((week) => (
              <option key={String(week.id)} value={String(week.id)}>
                {getGameweekLabel(week)}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1.5 text-xs font-medium text-[var(--text-secondary)]">
          Player
          <select
            required
            value={playerId}
            onChange={(e) => setPlayerId(e.target.value)}
            className="h-9 rounded-lg border border-input bg-[var(--surface2)] px-3 text-sm text-[var(--text-primary)] outline-none focus:border-ring"
          >
            {players.map((player) => (
              <option key={String(player.id)} value={String(player.id)}>
                {asText(player.name)}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1.5 text-xs font-medium text-[var(--text-secondary)]">
          Match number
          <input
            type="number"
            min="1"
            value={matchNumber}
            onChange={(e) => setMatchNumber(e.target.value)}
            className="h-9 rounded-lg border border-input bg-[var(--surface2)] px-3 font-mono text-sm text-[var(--text-primary)] outline-none focus:border-ring"
          />
        </label>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <p className="eyebrow mb-2.5">Performance statistics</p>
          <div className="field-grid">
            {(Object.keys(values) as (keyof MatchStatValues)[]).map((key) => (
              <label key={key}>
                {STAT_LABELS[key]}
                <input
                  type="number"
                  min="0"
                  step={key === "overs_bowled" ? "0.1" : "1"}
                  value={values[key]}
                  onChange={(e) => setValues((current) => ({ ...current, [key]: e.target.value }))}
                />
              </label>
            ))}
          </div>
        </div>

        <div className="lg:col-span-4">
          <p className="eyebrow mb-2.5">Match flags & outcomes</p>
          <div className="flex flex-col gap-2">
            {(Object.keys(flags) as (keyof MatchFlags)[]).map((key) => (
              <label className="toggle-row" key={key}>
                <span>{FLAG_LABELS[key]}</span>
                <input
                  type="checkbox"
                  checked={flags[key]}
                  onChange={(e) => setFlags((current) => ({ ...current, [key]: e.target.checked }))}
                />
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-2.5 border-t border-border pt-4">
        <button
          type="button"
          className="secondary"
          disabled={saving}
          onClick={resetForm}
        >
          Reset form
        </button>
        <button
          type="submit"
          className="primary"
          disabled={saving || !profileId || !gameweekId || !playerId}
        >
          {saving ? "Saving…" : "Save match facts"}
        </button>
      </div>
    </form>
  );
}
