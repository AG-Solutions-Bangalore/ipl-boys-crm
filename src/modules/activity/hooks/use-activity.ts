import { useCallback } from "react";
import { activityApi } from "@/modules/activity/api/activity.api";
import type { ActivityLogEntry } from "@/modules/activity/types/activity.types";
import { useRows } from "@/shared/hooks/use-rows";

export function useActivity(profileId: string) {
  const fetcher = useCallback(() => activityApi.list(profileId), [profileId]);
  return useRows<ActivityLogEntry>(
    "league_activity_log",
    { profile_id: profileId, order: "created_at.desc", limit: "200" },
    fetcher,
  );
}
