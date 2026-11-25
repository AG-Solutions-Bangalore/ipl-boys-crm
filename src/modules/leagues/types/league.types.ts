import type { Row } from "@/shared/types/common.types";

export type LeagueProfile = Row & {
  description?: unknown;
  starting_budget?: unknown;
  weight_enabled?: unknown;
  weight_trade_tolerance?: unknown;
  allow_negative_points?: unknown;
  roster_min?: unknown;
  roster_max?: unknown;
  enabled_chips?: unknown;
  release_cycles?: unknown;
  user_id?: unknown;
  created_at?: unknown;
};

export type LeagueSettingsForm = {
  starting_budget: string;
  weight_enabled: boolean;
  weight_trade_tolerance: string;
  allow_negative_points: boolean;
  roster_min: string;
  roster_max: string;
  enabled_chips: string;
  release_cycles: string;
};
