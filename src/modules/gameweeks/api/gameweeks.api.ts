import type { Gameweek } from "@/modules/gameweeks/types/gameweek.types";
import { tableApi } from "@/shared/api/table.api";
import type { Row } from "@/shared/types/common.types";

export const gameweeksApi = {
  list: () => tableApi.list<Gameweek>("gameweeks", { order: "number.asc" }),
  create: (row: Row) => tableApi.insert("gameweeks", row),
  update: (id: string, row: Row) => tableApi.update("gameweeks", id, row),
  setActive: (gameweekId: string) =>
    tableApi.rpc("set_active_gameweek", { gameweek_id: gameweekId }),
  recalculate: (profileId: string, gameweekId: string) =>
    tableApi.recalculate(profileId, gameweekId),
};
