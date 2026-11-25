import type { Row } from "@/shared/types/common.types";

export type ManagerProfile = Row & {
  user_id?: unknown;
  display_name?: unknown;
  email?: unknown;
  approved?: unknown;
};

export type ManagerAssignment = Row & {
  user_id?: unknown;
  team_id?: unknown;
  created_at?: unknown;
};
