import type { Player } from "@/modules/players/types/player.types";
import type { Franchise } from "@/modules/teams/types/team.types";
import { tableApi } from "@/shared/api/table.api";
import type { Row } from "@/shared/types/common.types";

export const playersApi = {
  list: () => tableApi.list<Player>("players", { order: "name.asc", limit: "500" }),
  franchises: () => tableApi.list<Franchise>("ipl_teams", { order: "name.asc" }),
  create: (row: Row) => tableApi.insert("players", row),
  createFranchise: (row: Row) => tableApi.insert("ipl_teams", row),
};
