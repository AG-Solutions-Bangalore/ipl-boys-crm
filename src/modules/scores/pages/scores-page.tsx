import { asText } from "@/lib/format";
import type { Gameweek } from "@/modules/gameweeks/types/gameweek.types";
import { AdminBonusManager } from "@/modules/scores/components/admin-bonus-manager";
import { ScoreEntryForm } from "@/modules/scores/components/score-entry-form";
import { useAdminBonusTeams } from "@/modules/scores/hooks/use-admin-bonuses";
import {
  usePlayerMatchStats,
  useScoreGameweeks,
  useScorePlayers,
  useTeamScores,
} from "@/modules/scores/hooks/use-scores";
import { useAdminContext } from "@/modules/shell/context/admin-context";
import { DataTable } from "@/shared/components/data-table";
import { PanelTitle } from "@/shared/components/panel-title";

const getGameweekLabel = (week: Gameweek) => {
  const name = asText(week.name).trim();
  const id = String(week.id || "").trim();
  if (name) {
    return id ? `${name} (${id})` : name;
  }
  return id ? `No name (${id})` : "No name";
};

const getTeamLabel = (team: { name?: unknown; id?: unknown }) => {
  return asText(team.name).trim() || "Unnamed team";
};

export function ScoresPage() {
  const { profileId } = useAdminContext();
  const scores = useTeamScores(profileId);
  const stats = usePlayerMatchStats(profileId);
  const players = useScorePlayers();
  const gameweeks = useScoreGameweeks();
  const teams = useAdminBonusTeams(profileId);

  const playerName = (id: unknown) =>
    asText(players.rows.find((player) => String(player.id) === String(id))?.name) ||
    String(id || "—");

  const gameweekName = (id: unknown) => {
    const found = gameweeks.rows.find((w) => String(w.id) === String(id));
    if (found) return getGameweekLabel(found);
    return String(id || "—");
  };

  const teamName = (id: unknown) => {
    const found = teams.rows.find((team) => String(team.id) === String(id));
    if (found) return getTeamLabel(found);
    return String(id || "—");
  };

  return (
    <>
      <PanelTitle
        eyebrow="Official results"
        title="Scores & match data"
        description="Enter scorecard facts for the selected league. Points and ranks are calculated on the server."
      />
      <ScoreEntryForm profileId={profileId} gameweeks={gameweeks.rows} players={players.rows} />
      <div className="panel">
        <div className="panel-head">
          <h3>Entered player match data</h3>
        </div>
        <DataTable
          rows={stats.rows.map((row) => ({
            ...row,
            gameweek_label: gameweekName(row.gameweek_id),
            player_name: playerName(row.player_id),
          }))}
          loading={stats.loading}
          columns={[
            { key: "gameweek_label", label: "Gameweek" },
            { key: "match_number", label: "Match" },
            { key: "player_name", label: "Player" },
            { key: "runs", label: "Runs" },
            { key: "balls", label: "Balls" },
            { key: "wickets", label: "Wickets" },
            { key: "overs_bowled", label: "Overs" },
            { key: "runs_conceded", label: "Conceded" },
            { key: "catches", label: "Catches" },
          ]}
        />
      </div>
      <div className="panel">
        <div className="panel-head">
          <h3>Calculated team totals</h3>
        </div>
        <DataTable
          rows={scores.rows.map((row) => ({
            ...row,
            gameweek_label: gameweekName(row.gameweek_id),
            team_name: teamName(row.team_id),
          }))}
          loading={scores.loading}
          columns={[
            { key: "gameweek_label", label: "Gameweek" },
            { key: "team_name", label: "Team" },
            { key: "points", label: "Week points" },
            { key: "total_points", label: "Season points" },
            { key: "rank", label: "Rank" },
            { key: "chip_applied", label: "Chip" },
          ]}
        />
      </div>
      <AdminBonusManager profileId={profileId} />
    </>
  );
}
