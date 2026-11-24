import { useEffect, useState, type FormEvent } from "react";
import { asText, isTrue } from "@/lib/format";
import { useUpdateLeague } from "@/modules/leagues/hooks/use-leagues";
import type { LeagueProfile, LeagueSettingsForm } from "@/modules/leagues/types/league.types";
import { PanelTitle } from "@/shared/components/panel-title";
import { useAppFeedback } from "@/shared/context/feedback-context";
import type { Row } from "@/shared/types/common.types";

const buildForm = (profile: LeagueProfile): LeagueSettingsForm => ({
  starting_budget: asText(profile.starting_budget || 5000),
  weight_enabled: isTrue(profile.weight_enabled),
  weight_trade_tolerance: asText(profile.weight_trade_tolerance || 0),
  allow_negative_points: isTrue(profile.allow_negative_points),
  roster_min: asText(profile.roster_min || 15),
  roster_max: asText(profile.roster_max || 18),
  enabled_chips: asText(profile.enabled_chips || "[]"),
  release_cycles: asText(profile.release_cycles || "[]"),
});

export function LeagueSettingsForm({ profile }: { profile: LeagueProfile }) {
  const updateLeague = useUpdateLeague();
  const { notify } = useAppFeedback();
  const [form, setForm] = useState<LeagueSettingsForm>(() => buildForm(profile));
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm(buildForm(profile));
  }, [profile.id]);

  const save = async (event: FormEvent) => {
    event.preventDefault();
    if (!profile.id) return;
    setSaving(true);
    try {
      const payload: Row = {
        ...form,
        starting_budget: Number(form.starting_budget),
        weight_trade_tolerance: Number(form.weight_trade_tolerance),
        roster_min: Number(form.roster_min),
        roster_max: Number(form.roster_max),
        enabled_chips: JSON.parse(form.enabled_chips),
        release_cycles: JSON.parse(form.release_cycles),
      };
      await updateLeague.mutateAsync({ id: String(profile.id), row: payload });
      notify("League settings saved.");
    } catch (err) {
      notify(`Could not save: ${(err as Error).message}`);
    } finally {
      setSaving(false);
    }
  };

  const set = <K extends keyof LeagueSettingsForm>(key: K, value: LeagueSettingsForm[K]) =>
    setForm((current) => ({ ...current, [key]: value }));

  return (
    <>
      <PanelTitle
        eyebrow="PROFILE CONFIGURATION"
        title={asText(profile.name)}
        description="These values control the rules stored for this league profile."
      />
      <form className="panel settings-form" onSubmit={save}>
        <div className="field-grid">
          <label>
            Starting budget
            <input
              type="number"
              min="0"
              value={form.starting_budget}
              onChange={(e) => set("starting_budget", e.target.value)}
            />
          </label>
          <label>
            Minimum roster
            <input
              type="number"
              min="1"
              max="18"
              value={form.roster_min}
              onChange={(e) => set("roster_min", e.target.value)}
            />
          </label>
          <label>
            Maximum roster
            <input
              type="number"
              min="1"
              max="18"
              value={form.roster_max}
              onChange={(e) => set("roster_max", e.target.value)}
            />
          </label>
          <label>
            Weight trade tolerance
            <input
              type="number"
              min="0"
              step="0.1"
              value={form.weight_trade_tolerance}
              onChange={(e) => set("weight_trade_tolerance", e.target.value)}
            />
          </label>
        </div>
        <div className="toggle-grid">
          <label className="toggle-row">
            <span>
              <b>Weight system</b>
              <small>Use Area 51 tier weights and trade balance rule</small>
            </span>
            <input
              type="checkbox"
              checked={form.weight_enabled}
              onChange={(e) => set("weight_enabled", e.target.checked)}
            />
          </label>
          <label className="toggle-row">
            <span>
              <b>Allow negative points</b>
              <small>Turn off for Mandem's no-negative scoring</small>
            </span>
            <input
              type="checkbox"
              checked={form.allow_negative_points}
              onChange={(e) => set("allow_negative_points", e.target.checked)}
            />
          </label>
        </div>
        <div className="field-grid">
          <label className="span-2">
            Enabled chips <small>JSON list, e.g. ["TC","MMC"]</small>
            <textarea
              rows={2}
              value={form.enabled_chips}
              onChange={(e) => set("enabled_chips", e.target.value)}
            />
          </label>
          <label className="span-2">
            Release cycles <small>JSON list</small>
            <textarea
              rows={2}
              value={form.release_cycles}
              onChange={(e) => set("release_cycles", e.target.value)}
            />
          </label>
        </div>
        <button className="primary" disabled={saving}>
          {saving ? "Saving…" : "Save profile settings"}
        </button>
      </form>
    </>
  );
}
