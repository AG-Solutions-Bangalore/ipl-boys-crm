import type { Row } from "@/shared/types/common.types";

export type TeamGameweekScore = Row & {
  gameweek_id?: unknown;
  team_id?: unknown;
  points?: unknown;
  total_points?: unknown;
  rank?: unknown;
  chip_applied?: unknown;
};

export type PlayerMatchStats = Row & {
  profile_id?: unknown;
  gameweek_id?: unknown;
  player_id?: unknown;
  match_number?: unknown;
  participation_type?: unknown;
};

export type AdminBonus = Row & {
  profile_id?: unknown;
  team_id?: unknown;
  gameweek_id?: unknown;
  points?: unknown;
  note?: unknown;
  created_at?: unknown;
};

export type MatchStatValues = {
  runs: string;
  balls: string;
  wickets: string;
  overs_bowled: string;
  runs_conceded: string;
  maidens: string;
  catches: string;
  stumpings: string;
  run_outs: string;
  direct_run_outs: string;
  split_run_outs: string;
  fours: string;
  sixes: string;
  hat_tricks: string;
};

export type MatchFlags = {
  is_out: boolean;
  is_dnp: boolean;
  team_win: boolean;
  motm: boolean;
  six_sixes: boolean;
  super_over: boolean;
};
