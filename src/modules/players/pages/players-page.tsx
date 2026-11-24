import { Plus } from "lucide-react";
import { useState } from "react";
import { useSession } from "@/modules/auth/hooks/use-session";
import { AddFranchiseForm } from "@/modules/players/components/add-franchise-form";
import { AddPlayerForm } from "@/modules/players/components/add-player-form";
import { usePlayerFranchises, usePlayers } from "@/modules/players/hooks/use-players";
import { DataTable } from "@/shared/components/data-table";
import { PanelTitle } from "@/shared/components/panel-title";

export function PlayersPage() {
  const { isAppAdmin } = useSession();
  const players = usePlayers();
  const franchises = usePlayerFranchises();
  const [adding, setAdding] = useState(false);
  const [addingFranchise, setAddingFranchise] = useState(false);

  return (
    <>
      <PanelTitle
        eyebrow="AUCTION POOL"
        title="Player pool"
        description="Maintain the IPL franchise catalog and the player catalog used by auctions and scoring."
        actions={
          isAppAdmin && (
            <>
              <button className="secondary" onClick={() => setAddingFranchise((value) => !value)}>
                <Plus size={14} /> Add franchise
              </button>
              <button className="primary" onClick={() => setAdding((value) => !value)}>
                <Plus size={14} /> Add player
              </button>
            </>
          )
        }
      />
      {addingFranchise && <AddFranchiseForm onClose={() => setAddingFranchise(false)} />}
      {adding && (
        <AddPlayerForm
          franchises={franchises.rows}
          franchiseLoading={franchises.loading}
          onClose={() => setAdding(false)}
        />
      )}
      <div className="panel">
        <div className="panel-head">
          <h3>IPL franchises</h3>
        </div>
        <DataTable
          rows={franchises.rows}
          loading={franchises.loading}
          columns={[
            { key: "id", label: "ID" },
            { key: "name", label: "Franchise" },
            { key: "short", label: "Short name" },
            { key: "color", label: "Color" },
          ]}
        />
      </div>
      <div className="panel">
        <DataTable
          rows={players.rows}
          loading={players.loading}
          columns={[
            { key: "name", label: "Player" },
            { key: "role", label: "Role" },
            { key: "ipl_team_id", label: "Franchise" },
            { key: "tier", label: "Tier" },
            { key: "weight", label: "Weight" },
            { key: "base_price", label: "Base price" },
          ]}
        />
      </div>
    </>
  );
}
