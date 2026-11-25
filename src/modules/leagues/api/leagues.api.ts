import { http } from "@/lib/axios";
import type { LeagueProfile } from "@/modules/leagues/types/league.types";
import { tableApi } from "@/shared/api/table.api";
import type { Row } from "@/shared/types/common.types";

export const leaguesApi = {
  listProfiles: async (): Promise<LeagueProfile[]> => {
    const { data } = await http.get<LeagueProfile[]>("/auth/profiles");
    return data;
  },
  get: (profileId: string) =>
    tableApi.list<LeagueProfile>("game_profiles", { id: profileId, limit: "1" }),
  create: (row: Row) => tableApi.insert("game_profiles", row),
  update: (id: string, row: Row) => tableApi.update("game_profiles", id, row),
};
