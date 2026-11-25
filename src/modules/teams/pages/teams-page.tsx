import { Plus } from "lucide-react";
import { useState } from "react";
import { useSession } from "@/modules/auth/hooks/use-session";
import { useAdminContext } from "@/modules/shell/context/admin-context";
import { CreateTeamForm } from "@/modules/teams/components/create-team-form";
import { useTeamFranchises, useTeamProfile, useTeams } from "@/modules/teams/hooks/use-teams";
import { DataTable } from "@/shared/components/data-table";
import { PanelTitle } from "@/shared/components/panel-title";

export function TeamsPage() {
  const { profileId } = useAdminContext();
  const { isAdmin } = useSession();
  const teams = useTeams(profileId);
  const franchises = useTeamFranchises();
  const profileRows = useTeamProfile(profileId);
  const startingBudget = Number(profileRows.rows[0]?.starting_budget) || 5000;
  const [adding, setAdding] = useState(false);

  return (
    <>
      <PanelTitle
        eyebrow="Squad management"
        title="Fantasy teams"
        description="Review league rosters, budgets, owners, and franchise assignments."
        actions={
          isAdmin && (
            <button type="button" className="primary" onClick={() => setAdding((value) => !value)}>
              <Plus size={14} strokeWidth={1.75} /> Add team
            </button>
          )
        }
      />
      {adding && (
        <CreateTeamForm
          profileId={profileId}
          franchises={franchises.rows}
          startingBudget={startingBudget}
          sortOrder={teams.rows.length}
          onClose={() => setAdding(false)}
        />
      )}
      <div className="panel">
        <DataTable
          rows={teams.rows.map((team) => ({
            ...team,
            franchise_name:
              franchises.rows.find((franchise) => String(franchise.id) === String(team.ipl_team_id))
                ?.name || team.ipl_team_id,
          }))}
          loading={teams.loading || franchises.loading}
          columns={[
            { key: "name", label: "Fantasy team" },
            { key: "owner", label: "Manager" },
            { key: "budget", label: "Budget" },
            { key: "squad_value", label: "Squad value" },
            { key: "franchise_name", label: "IPL franchise" },
          ]}
        />
      </div>
    </>
  );
}
