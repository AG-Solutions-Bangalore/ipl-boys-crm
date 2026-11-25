import { ArrowUpRight, BadgeCheck, Clock3, Gavel, Shield, Swords } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSession } from "@/modules/auth/hooks/use-session";

export function QuickActions() {
  const navigate = useNavigate();
  const { isAppAdmin } = useSession();

  const actions = [
    ...(isAppAdmin
      ? [
          {
            path: "/approvals",
            icon: BadgeCheck,
            title: "Review signups",
            subtitle: "Approve or deny pending manager accounts",
          },
        ]
      : []),
    {
      path: "/auction",
      icon: Gavel,
      title: "Open auction desk",
      subtitle: "Assign unsold players and verify team purses",
    },
    {
      path: "/gameweeks",
      icon: Clock3,
      title: "Manage gameweeks",
      subtitle: "Set deadlines, lock lineups, and recalculate points",
    },
    {
      path: "/trades",
      icon: Swords,
      title: "Review trades",
      subtitle: "Process pending player transfers and loans",
    },
    {
      path: "/leagues",
      icon: Shield,
      title: "League rules",
      subtitle: "Configure budgets, chips, and roster boundaries",
    },
  ];

  return (
    <section className="panel">
      <div className="panel-head">
        <div>
          <p className="eyebrow">Quick actions</p>
          <h3>Run the league</h3>
        </div>
      </div>
      <div className="quick-actions">
        {actions.map(({ path, icon: Icon, title, subtitle }) => (
          <button type="button" key={path} onClick={() => navigate(path)}>
            <span className="quick-action-icon" aria-hidden="true">
              <Icon size={16} strokeWidth={1.75} />
            </span>
            <span>
              <b>{title}</b>
              <small>{subtitle}</small>
            </span>
            <ArrowUpRight size={15} strokeWidth={1.75} aria-hidden="true" />
          </button>
        ))}
      </div>
    </section>
  );
}
