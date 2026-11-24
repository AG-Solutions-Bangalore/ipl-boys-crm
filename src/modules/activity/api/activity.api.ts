import type { ActivityLogEntry } from "@/modules/activity/types/activity.types";
import { tableApi } from "@/shared/api/table.api";

export const activityApi = {
  list: (profileId: string) =>
    tableApi.list<ActivityLogEntry>("league_activity_log", {
      profile_id: profileId,
      order: "created_at.desc",
      limit: "200",
    }),
};
