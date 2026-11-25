import type { Row } from "@/shared/types/common.types";

export type FantasyTeam = Row & {
  profile_id?: unknown;
  owner?: unknown;
  budget?: unknown;
  ipl_team_id?: unknown;
  squad_value?: unknown;
  sort_order?: unknown;
  created_at?: unknown;
};

export type Franchise = Row & {
  short?: unknown;
  color?: unknown;
  wins?: unknown;
  losses?: unknown;
  match_results?: unknown;
};

export type TeamFormValues = {
  name: string;
  owner: string;
  budget: string;
  ipl_team_id: string;
};
