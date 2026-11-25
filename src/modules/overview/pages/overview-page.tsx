import { ArrowUpRight, BadgeCheck, Clock3, Swords, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { asText, formatDateTime, isTrue } from "@/lib/format";
import { useSession } from "@/modules/auth/hooks/use-session";
import { MetricCard } from "@/modules/overview/components/metric-card";
import { ProfileCards } from "@/modules/overview/components/profile-cards";
import { QuickActions } from "@/modules/overview/components/quick-actions";
import { useOverviewData } from "@/modules/overview/hooks/use-overview";
import { useAdminContext } from "@/modules/shell/context/admin-context";
import { DataTable } from "@/shared/components/data-table";

export function OverviewPage() {
  const { profileId, profiles, selectedProfile } = useAdminContext();
  const { isAppAdmin } = useSession();
  const { teams, pending, weeks, trades } = useOverviewData(profileId);
  const navigate = useNavigate();
  const active = weeks.rows.find((week) => isTrue(week.is_active));
  const activeLocked = active ? isTrue(active.is_locked) : false;

  const statusPillClass = !active
    ? "season-pill"
    : activeLocked
      ? "season-pill is-locked"
      : "season-pill is-live";

  const statusLabel = !active
    ? "No active gameweek"
    : `${asText(active.name)} · ${activeLocked ? "Locked" : "Open"}`;

  return (
    <>
      <div className="welcome-row">
        <div>
          <p className="eyebrow">League operations</p>
          <h2>{asText(selectedProfile?.name) || "Choose a league"}</h2>
          <p className="muted">
            Manage the season, keep records consistent, and review changes before they reach
            managers.
          </p>
        </div>
        <span className={statusPillClass}>
          <span className="online-dot" aria-hidden="true" />
          {statusLabel}
        </span>
      </div>

      <div className="metric-grid">
        <MetricCard
          label="Fantasy teams"
          value={teams.rows.length}
          loading={teams.loading}
          icon={Users}
          caption="Registered in league"
          onClick={() => navigate("/teams")}
        />
        <MetricCard
          label="Pending approvals"
          value={pending.rows.length}
          loading={pending.loading}
          icon={BadgeCheck}
          attention={pending.rows.length > 0}
          caption={pending.rows.length > 0 ? "Review signups" : "All signups cleared"}
          onClick={isAppAdmin ? () => navigate("/approvals") : undefined}
        />
        <MetricCard
          label="Active gameweek"
          value={asText(active?.name) || "—"}
          loading={weeks.loading}
          icon={Clock3}
          caption={
            active
              ? `Deadline ${formatDateTime(active.deadline || active.lock_time)}`
              : "Set an active gameweek"
          }
          onClick={() => navigate("/gameweeks")}
        />
        <MetricCard
          label="Pending trades"
          value={trades.rows.length}
          loading={trades.loading}
          icon={Swords}
          attention={trades.rows.length > 0}
          caption={trades.rows.length > 0 ? "Awaiting decision" : "No pending trades"}
          onClick={() => navigate("/trades")}
        />
      </div>

      <div className="overview-grid">
        <QuickActions />
        <section className="panel">
          <div className="panel-head">
            <div>
              <p className="eyebrow">Season flow</p>
              <h3>Gameweek calendar</h3>
            </div>
            <button type="button" className="text-button" onClick={() => navigate("/gameweeks")}>
              All weeks <ArrowUpRight size={14} strokeWidth={1.75} aria-hidden="true" />
            </button>
          </div>
          <DataTable
            rows={weeks.rows.slice(0, 5)}
            loading={weeks.loading}
            columns={[
              { key: "name", label: "Gameweek" },
              { key: "deadline", label: "Deadline" },
              { key: "is_active", label: "Active" },
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
