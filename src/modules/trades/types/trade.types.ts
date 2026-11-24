import type { Row } from "@/shared/types/common.types";

export type Trade = Row & {
  created_at?: unknown;
  type?: unknown;
  from_team_id?: unknown;
  to_team_id?: unknown;
  status?: unknown;
  cash_from?: unknown;
  cash_to?: unknown;
};
