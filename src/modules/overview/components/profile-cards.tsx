import { ArrowDownToLine } from "lucide-react";
import { asText } from "@/lib/format";
import type { LeagueProfile } from "@/modules/leagues/types/league.types";

export function ProfileCards({ profiles }: { profiles: LeagueProfile[] }) {
  return (
    <section className="panel">
      <div className="panel-head">
        <div>
          <p className="eyebrow">League structure</p>
          <h3>Active league profiles</h3>
        </div>
        <span className="mini-tag">{profiles.length} profiles</span>
      </div>
      <div className="profile-cards">
        {profiles.map((profile) => (
          <article key={String(profile.id)}>
            <span className="profile-symbol" aria-hidden="true">{asText(profile.name).slice(0, 1)}</span>
            <div>
              <b>{asText(profile.name)}</b>
              <small>{asText(profile.description) || "League profile"}</small>
            </div>
            <ArrowDownToLine size={14} strokeWidth={1.5} aria-hidden="true" />
          </article>
        ))}
      </div>
    </section>
  );
}
