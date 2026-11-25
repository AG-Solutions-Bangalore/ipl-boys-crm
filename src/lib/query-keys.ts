import type { QueryParams } from "@/shared/types/common.types";

export const queryKeys = {
  currentUser: ["auth", "current-user"] as const,
  profiles: ["profiles"] as const,
  rows: (table: string, params: QueryParams = {}) => ["rows", table, params] as const,
};
