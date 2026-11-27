import type { Row } from "@/shared/types/common.types";

export type ApprovalProfile = Row & {
  display_name?: unknown;
  email?: unknown;
  created_at?: unknown;
  approved?: unknown;
  status?: unknown;
};

export type LeagueLeadRequest = Row & {
  id: string;
  league_name: string;
  display_name: string;
};
