import type { Row } from "@/shared/types/common.types";

export type Player = Row & {
  role?: unknown;
  ipl_team_id?: unknown;
  tier?: unknown;
  weight?: unknown;
  base_price?: unknown;
};

export type PlayerFormValues = {
  name: string;
  role: string;
  ipl_team_id: string;
  tier: string;
  weight: string;
  base_price: string;
};

export type FranchiseFormValues = {
  id: string;
  name: string;
  short: string;
  color: string;
};
