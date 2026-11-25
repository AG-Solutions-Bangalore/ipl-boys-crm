import { useActivity } from "@/modules/activity/hooks/use-activity";
import { useAdminContext } from "@/modules/shell/context/admin-context";
import { DataTable } from "@/shared/components/data-table";
import { PanelTitle } from "@/shared/components/panel-title";

export function ActivityPage() {
  const { profileId } = useAdminContext();
  const activity = useActivity(profileId);

  return (
    <>
      <PanelTitle
        eyebrow="Audit trail"
        title="League activity"
        description="Recent changes recorded by the league API."
      />
      <div className="panel">
        <DataTable
          rows={activity.rows}
          loading={activity.loading}
          columns={[
            { key: "created_at", label: "Time" },
            { key: "activity_type", label: "Type" },
            { key: "description", label: "Activity" },
            { key: "user_id", label: "Actor" },
          ]}
        />
      </div>
    </>
  );
}
