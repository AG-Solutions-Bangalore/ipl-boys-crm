import { ArrowUpRight, BadgeCheck, Clock3, Shield, Swords } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function QuickActions() {
  const navigate = useNavigate();

  return (
    <section className="panel">
      <div className="panel-head">
        <div>
          <p className="eyebrow">Quick actions</p>
          <h3>Run the league</h3>
        </div>
      </div>
      <div className="quick-actions">
        <button onClick={() => navigate("/approvals")}>
          <BadgeCheck size={16} strokeWidth={1.5} aria-hidden="true" />
          <span>
            <b>Review signups</b>
            <small>Approve or deny access</small>
          </span>
          <ArrowUpRight size={14} strokeWidth={1.5} aria-hidden="true" />
        </button>
        <button onClick={() => navigate("/gameweeks")}>
          <Clock3 size={16} strokeWidth={1.5} aria-hidden="true" />
          <span>
            <b>Manage gameweeks</b>
            <small>Set deadlines and recalculate</small>
          </span>
          <ArrowUpRight size={14} strokeWidth={1.5} aria-hidden="true" />
        </button>
        <button onClick={() => navigate("/trades")}>
          <Swords size={16} strokeWidth={1.5} aria-hidden="true" />
          <span>
            <b>Review trades</b>
            <small>Process pending exchanges</small>
          </span>
          <ArrowUpRight size={14} strokeWidth={1.5} aria-hidden="true" />
        </button>
        <button onClick={() => navigate("/leagues")}>
          <Shield size={16} strokeWidth={1.5} aria-hidden="true" />
          <span>
            <b>League rules</b>
            <small>Budgets, chips, roster limits</small>
          </span>
          <ArrowUpRight size={14} strokeWidth={1.5} aria-hidden="true" />
        </button>
      </div>
    </section>
  );
}
