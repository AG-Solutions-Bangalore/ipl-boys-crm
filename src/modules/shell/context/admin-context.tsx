import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useSession } from "@/modules/auth/hooks/use-session";
import { useLeagueProfiles } from "@/modules/leagues/hooks/use-leagues";
import type { LeagueProfile } from "@/modules/leagues/types/league.types";

type AdminContextValue = {
  profiles: LeagueProfile[];
  profileId: string;
  setProfileId: (id: string) => void;
  selectedProfile?: LeagueProfile;
};

const AdminContext = createContext<AdminContextValue | null>(null);

export function AdminProvider({ children }: { children: ReactNode }) {
  const { isAdmin } = useSession();
  const profilesQuery = useLeagueProfiles(isAdmin);
  const profiles = useMemo(() => profilesQuery.data ?? [], [profilesQuery.data]);
  const [profileId, setProfileId] = useState("");

  useEffect(() => {
    if (!profileId && profiles[0]?.id) setProfileId(String(profiles[0].id));
  }, [profileId, profiles]);

  const value = useMemo<AdminContextValue>(
    () => ({
      profiles,
      profileId,
      setProfileId,
      selectedProfile: profiles.find((profile) => String(profile.id) === profileId),
    }),
    [profiles, profileId],
  );

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

export function useAdminContext() {
  const context = useContext(AdminContext);
  if (!context) throw new Error("useAdminContext must be used inside AdminProvider");
  return context;
}
