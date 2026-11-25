import { cn } from "cn";
import { Check } from "lucide-react";
import { asText } from "@/lib/format";
import type { LeagueProfile } from "@/modules/leagues/types/league.types";
import { useAdminContext } from "@/modules/shell/context/admin-context";

export function ProfileCards({ profiles }: { profiles: LeagueProfile[] }) {
  const { profileId, setProfileId } = useAdminContext();

  return (
    <section className="panel">
      <div className="panel-head">
        <div>
          <p className="eyebrow">League structure</p>
          <h3>Active league profiles</h3>
        </div>
        <span className="mini-tag">
          {profiles.length} {profiles.length === 1 ? "profile" : "profiles"}
        </span>
      </div>
      <div className="profile-cards">
        {profiles.map((profile) => {
          const id = String(profile.id ?? "");
          const selected = id === profileId;
          const name = asText(profile.name) || "Unnamed profile";
          const description = asText(profile.description);
          const budget = asText(profile.starting_budget);
          const meta = description || (budget ? `Purse ${budget}` : "League profile");

          return (
            <button
              type="button"
              key={id}
              aria-pressed={selected}
              onClick={() => id && setProfileId(id)}
              className={cn("profile-card-btn", selected && "is-selected")}
            >
              <span className="profile-symbol" aria-hidden="true">
                {name.slice(0, 1).toUpperCase()}
              </span>
              <span className="profile-card-meta">
                <b>{name}</b>
                <small>{meta}</small>
              </span>
              <span className="profile-card-badge">
                {selected ? (
                  <span className="inline-flex items-center gap-1">
                    <Check size={12} strokeWidth={2} aria-hidden="true" /> Active
                  </span>
                ) : (
                  "Switch"
                )}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
