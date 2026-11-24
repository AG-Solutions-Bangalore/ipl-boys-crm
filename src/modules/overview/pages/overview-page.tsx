import { ArrowUpRight, BadgeCheck, Clock3, Swords, Users } from "lucide-react";
import { asText, isTrue } from "@/lib/format";
import { MetricCard } from "@/modules/overview/components/metric-card";
import { ProfileCards } from "@/modules/overview/components/profile-cards";
import { QuickActions } from "@/modules/overview/components/quick-actions";
import { useOverviewData } from "@/modules/overview/hooks/use-overview";
import { useAdminContext } from "@/modules/shell/context/admin-context";
import { DataTable } from "@/shared/components/data-table";
import { useNavigate } from "react-router-dom";

export function OverviewPage() {
  const { profileId, profiles, selectedProfile } = useAdminContext();
  const { teams, pending, weeks, trades } = useOverviewData(profileId);
  const navigate = useNavigate();
  const active = weeks.rows.find((week) => isTrue(week.is_active));

  return (
    <>
      <div className="welcome-row">
        <div>
          <p className="eyebrow">LEAGUE OPERATIONS / 2026 SEASON</p>
          <h2>{asText(selectedProfile?.name) || "Choose a league"}</h2>
          <p className="muted">
            Manage the season, keep records consistent, and review changes before they reach
            managers.
          </p>
        </div>
        <span className="season-pill">
          <span className="online-dot" />
          SYSTEM ONLINE
        </span>
      </div>
      <div className="metric-grid">
        <MetricCard
          label="Fantasy teams"
          value={teams.rows.length}
          icon={Users}
          caption="In this league"
        />
        <MetricCard
          label="Pending approvals"
          value={pending.rows.length}
          icon={BadgeCheck}
          caption="Waiting for review"
        />
        <MetricCard
          label="Active gameweek"
          value={asText(active?.name) || "—"}
          icon={Clock3}
          caption={
            active
              ? `Deadline ${asText(active.deadline || active.lock_time)}`
              : "No active gameweek"
          }
        />
        <MetricCard
          label="Pending trades"
          value={trades.rows.length}
          icon={Swords}
          caption="Need a decision"
        />
      </div>
      <div className="overview-grid">
        <QuickActions />
        <section className="panel">
          <div className="panel-head">
            <div>
              <p className="eyebrow">SEASON FLOW</p>
              <h3>Gameweek calendar</h3>
            </div>
            <button className="text-button" onClick={() => navigate("/gameweeks")}>
              All weeks <ArrowUpRight size={14} />
            </button>
          </div>
          <DataTable
            rows={weeks.rows.slice(0, 5)}
            loading={false}
            columns={[
              { key: "name", label: "Gameweek" },
              { key: "deadline", label: "Deadline" },
              { key: "is_locked", label: "Locked" },
            ]}
            empty="Create gameweeks to start your season"
          />
        </section>
      </div>
      <ProfileCards profiles={profiles} />
    </>
  );
}
