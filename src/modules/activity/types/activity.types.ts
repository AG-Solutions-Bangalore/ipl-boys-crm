import type { Row } from "@/shared/types/common.types";

export type ActivityLogEntry = Row & {
  created_at?: unknown;
  activity_type?: unknown;
  description?: unknown;
  user_id?: unknown;
};
