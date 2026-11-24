import type { Row } from "@/shared/types/common.types";

export type Gameweek = Row & {
  number?: unknown;
  deadline?: unknown;
  lock_time?: unknown;
  game_count?: unknown;
  is_active?: unknown;
  is_locked?: unknown;
  is_complete?: unknown;
};

export type GameweekFormValues = {
  name: string;
  deadline: string;
  game_count: string;
};
