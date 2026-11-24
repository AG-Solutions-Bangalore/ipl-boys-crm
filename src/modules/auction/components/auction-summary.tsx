import { Shield } from "lucide-react";
import { asText } from "@/lib/format";
import type { Player } from "@/modules/players/types/player.types";
import type { FantasyTeam } from "@/modules/teams/types/team.types";

export function AuctionSummary({
  selectedPlayer,
  selectedTeam,
  price,
}: {
  selectedPlayer?: Player;
  selectedTeam?: FantasyTeam;
  price: string;
}) {
  return (
    <section className="panel auction-summary">
      <p className="eyebrow">PURCHASE CHECK</p>
      <h3>{asText(selectedPlayer?.name) || "Select a player"}</h3>
      <div className="summary-line">
        <span>Buyer</span>
        <b>{asText(selectedTeam?.name) || "—"}</b>
      </div>
      <div className="summary-line">
        <span>Current budget</span>
        <b>{asText(selectedTeam?.budget) || "—"}</b>
      </div>
      <div className="summary-line">
        <span>Base price</span>
        <b>{asText(selectedPlayer?.base_price) || "—"}</b>
      </div>
      <div className="summary-line total">
        <span>Budget after sale</span>
        <b>{selectedTeam ? Number(selectedTeam.budget || 0) - Number(price || 0) : "—"}</b>
      </div>
      <p className="hint">
        <Shield size={15} /> IPL franchises count as auction assets and do not use one of the 15–18
        player slots.
      </p>
    </section>
  );
}
