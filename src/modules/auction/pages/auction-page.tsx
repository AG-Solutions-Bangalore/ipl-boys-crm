import { useEffect, useMemo, useState, type FormEvent } from "react";
import { asText } from "@/lib/format";
import { AuctionForm } from "@/modules/auction/components/auction-form";
import { AuctionSummary } from "@/modules/auction/components/auction-summary";
import {
  useAuctionAssignments,
  useAuctionPlayers,
  useAuctionTeams,
  useExecuteAuctionSale,
} from "@/modules/auction/hooks/use-auction";
import { useAdminContext } from "@/modules/shell/context/admin-context";
import { DataTable } from "@/shared/components/data-table";
import { PanelTitle } from "@/shared/components/panel-title";
import { useAppFeedback } from "@/shared/context/feedback-context";

export function AuctionPage() {
  const { profileId } = useAdminContext();
  const teams = useAuctionTeams(profileId);
  const players = useAuctionPlayers();
  const assignments = useAuctionAssignments(profileId);
  const sellMutation = useExecuteAuctionSale();
  const { notify, showError } = useAppFeedback();
  const [teamId, setTeamId] = useState("");
  const [playerId, setPlayerId] = useState("");
  const [price, setPrice] = useState("");
  const [filter, setFilter] = useState("");
  const [busy, setBusy] = useState(false);

  const unassigned = useMemo(
    () =>
      players.rows.filter(
        (player) =>
          !assignments.rows.some(
            (assignment) => String(assignment.player_id) === String(player.id),
          ) && asText(player.name).toLowerCase().includes(filter.toLowerCase()),
      ),
    [players.rows, assignments.rows, filter],
  );

  useEffect(() => {
    if (!teamId && teams.rows[0]?.id) setTeamId(String(teams.rows[0].id));
    if (!unassigned.some((player) => String(player.id) === playerId) && unassigned[0]?.id)
      setPlayerId(String(unassigned[0].id));
  }, [teams.rows, unassigned, teamId, playerId]);

  const selectedPlayer = players.rows.find((player) => String(player.id) === playerId);
  const selectedTeam = teams.rows.find((team) => String(team.id) === teamId);

  useEffect(() => {
    if (selectedPlayer) setPrice(asText(selectedPlayer.base_price || 0));
  }, [playerId]);

  const sell = async (event: FormEvent) => {
    event.preventDefault();
    if (!teamId || !playerId) return;
    setBusy(true);
    try {
      await sellMutation.mutateAsync({ profileId, teamId, playerId, price: Number(price) });
      notify(`${asText(selectedPlayer?.name)} sold to ${asText(selectedTeam?.name)} for ${price}.`);
      setPlayerId("");
    } catch (err) {
      showError((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <PanelTitle
        eyebrow="Live auction"
        title="Auction desk"
        description="Record player sales in real-time. Budget, ownership, base price, and roster caps are validated on the server."
      />
      <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <AuctionForm
            teams={teams.rows}
            unassigned={unassigned}
            teamId={teamId}
            playerId={playerId}
            price={price}
            filter={filter}
            selectedPlayer={selectedPlayer}
            selectedTeam={selectedTeam}
            busy={busy}
            onTeamChange={setTeamId}
            onPlayerChange={setPlayerId}
            onPriceChange={setPrice}
            onFilterChange={setFilter}
            onSubmit={sell}
          />
        </div>
        <div className="lg:col-span-5">
          <AuctionSummary selectedPlayer={selectedPlayer} selectedTeam={selectedTeam} price={price} />
        </div>
      </div>
      <section className="panel">
        <div className="panel-head">
          <div>
            <p className="eyebrow">Available assets</p>
            <h3>
              Unsold pool <span className="count-pill">{unassigned.length}</span>
            </h3>
          </div>
        </div>
        <DataTable
          rows={unassigned.slice(0, 50)}
          loading={false}
          columns={[
            { key: "name", label: "Player / asset" },
            { key: "role", label: "Role" },
            { key: "ipl_team_id", label: "Franchise" },
            { key: "tier", label: "Tier" },
            { key: "base_price", label: "Base price" },
          ]}
        />
      </section>
    </>
  );
}
