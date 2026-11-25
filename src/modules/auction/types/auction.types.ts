import type { Row } from "@/shared/types/common.types";

export type PlayerAssignment = Row & {
  profile_id?: unknown;
  player_id?: unknown;
  team_id?: unknown;
};
