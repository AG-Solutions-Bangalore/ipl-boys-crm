import { useEffect, useState, type FormEvent } from "react";
import { asText } from "@/lib/format";
import type { Gameweek } from "@/modules/gameweeks/types/gameweek.types";
import type { Player } from "@/modules/players/types/player.types";
import { useSaveMatchStats } from "@/modules/scores/hooks/use-scores";
import type { MatchFlags, MatchStatValues } from "@/modules/scores/types/score.types";
import { useAppFeedback } from "@/shared/context/feedback-context";

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

const defaultFlags: MatchFlags = {
  is_out: true,
  is_dnp: false,
  team_win: false,
  motm: false,
  six_sixes: false,
  super_over: false,
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
  const { notify } = useAppFeedback();
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
      notify(`Could not save match stats: ${(err as Error).message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="panel add-form" onSubmit={addStats}>
      <h3>Enter one player's match line</h3>
      <label>
        Gameweek
        <select required value={gameweekId} onChange={(e) => setGameweekId(e.target.value)}>
          {gameweeks.map((week) => (
            <option key={String(week.id)} value={String(week.id)}>
              {asText(week.name)}
            </option>
          ))}
        </select>
      </label>
      <label>
        Player
        <select required value={playerId} onChange={(e) => setPlayerId(e.target.value)}>
          {players.map((player) => (
            <option key={String(player.id)} value={String(player.id)}>
              {asText(player.name)}
            </option>
          ))}
        </select>
      </label>
      <label>
        Match number
        <input
          type="number"
          min="1"
          value={matchNumber}
          onChange={(e) => setMatchNumber(e.target.value)}
        />
      </label>
      <div className="field-grid">
        {Object.entries(values).map(([key, value]) => (
          <label key={key}>
            {key.replaceAll("_", " ")}
            <input
              type="number"
              min="0"
              step={key === "overs_bowled" ? "0.1" : "1"}
              value={value}
              onChange={(e) =>
                setValues((current) => ({ ...current, [key]: e.target.value }) as MatchStatValues)
              }
            />
          </label>
        ))}
      </div>
      <div className="toggle-grid">
        {Object.entries(flags).map(([key, value]) => (
          <label className="toggle-row" key={key}>
            <span>{key.replaceAll("_", " ")}</span>
            <input
              type="checkbox"
              checked={value}
              onChange={(e) =>
                setFlags((current) => ({ ...current, [key]: e.target.checked }) as MatchFlags)
              }
            />
          </label>
        ))}
      </div>
      <button className="primary" disabled={saving || !profileId || !gameweekId || !playerId}>
        {saving ? "Saving…" : "Save match facts"}
      </button>
    </form>
  );
}
