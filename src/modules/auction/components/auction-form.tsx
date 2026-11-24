import { Gavel } from "lucide-react";
import type { FormEvent } from "react";
import { asText } from "@/lib/format";
import type { Player } from "@/modules/players/types/player.types";
import type { FantasyTeam } from "@/modules/teams/types/team.types";

export function AuctionForm({
  teams,
  unassigned,
  teamId,
  playerId,
  price,
  filter,
  selectedPlayer,
  selectedTeam,
  busy,
  onTeamChange,
  onPlayerChange,
  onPriceChange,
  onFilterChange,
  onSubmit,
}: {
  teams: FantasyTeam[];
  unassigned: Player[];
  teamId: string;
  playerId: string;
  price: string;
  filter: string;
  selectedPlayer?: Player;
  selectedTeam?: FantasyTeam;
  busy: boolean;
  onTeamChange: (value: string) => void;
  onPlayerChange: (value: string) => void;
  onPriceChange: (value: string) => void;
  onFilterChange: (value: string) => void;
  onSubmit: (event: FormEvent) => void;
}) {
  return (
    <form className="panel auction-form" onSubmit={onSubmit}>
      <div className="panel-head">
        <div>
          <p className="eyebrow">SALE RECORDER</p>
          <h3>Assign an unsold asset</h3>
        </div>
        <Gavel size={18} />
      </div>
      <label>
        Fantasy team
        <select required value={teamId} onChange={(e) => onTeamChange(e.target.value)}>
          {teams.map((team) => (
            <option value={String(team.id)} key={String(team.id)}>
              {asText(team.name)} · budget {asText(team.budget)}
            </option>
          ))}
        </select>
      </label>
      <label>
        Search player pool
        <input
          value={filter}
          onChange={(e) => onFilterChange(e.target.value)}
          placeholder="Filter by player or franchise"
        />
      </label>
      <label>
        Player
        <select required value={playerId} onChange={(e) => onPlayerChange(e.target.value)}>
          {unassigned.map((player) => (
            <option value={String(player.id)} key={String(player.id)}>
              {asText(player.name)} · {asText(player.role)} · base {asText(player.base_price)}
            </option>
          ))}
        </select>
      </label>
      <label>
        Sale price
        <input
          required
          min={Number(selectedPlayer?.base_price) || 0}
          type="number"
          value={price}
          onChange={(e) => onPriceChange(e.target.value)}
        />
      </label>
      <button className="primary" disabled={busy || !selectedPlayer || !selectedTeam}>
        {busy ? "Recording…" : "Confirm sale"}
      </button>
    </form>
  );
}
