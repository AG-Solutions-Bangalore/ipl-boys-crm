import { useSession } from "@/modules/auth/hooks/use-session";
import { CreateLeagueForm } from "@/modules/leagues/components/create-league-form";
import { LeagueSettingsForm } from "@/modules/leagues/components/league-settings-form";
import { useAdminContext } from "@/modules/shell/context/admin-context";
import { PanelTitle } from "@/shared/components/panel-title";

export function LeaguesPage() {
  const { selectedProfile, profiles } = useAdminContext();
  const { user, isAppAdmin } = useSession();

  return (
    <>
      {selectedProfile ? (
        <LeagueSettingsForm profile={selectedProfile} />
      ) : (
        <PanelTitle
          eyebrow="Profile configuration"
          title="League profiles"
          description="Create a league profile before adding its teams, managers, and season rules."
        />
      )}
      {isAppAdmin && <CreateLeagueForm profileCount={profiles.length} userId={user?.id ?? ""} />}
    </>
  );
}
