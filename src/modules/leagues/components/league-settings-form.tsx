import { useEffect, useState, type FormEvent } from "react";
import { Check, Coins, Loader2, Sparkles, UserCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { asText, isTrue } from "@/lib/format";
import { useUpdateLeague } from "@/modules/leagues/hooks/use-leagues";
import type { LeagueProfile, LeagueSettingsForm } from "@/modules/leagues/types/league.types";
import { PanelTitle } from "@/shared/components/panel-title";
import { useAppFeedback } from "@/shared/context/feedback-context";
import type { Row } from "@/shared/types/common.types";

const AVAILABLE_CHIPS = [
  { id: "TC", label: "Triple Captain (TC)", description: "3x points for selected player" },
  {
    id: "MMC",
    label: "Mega Match Captain (MMC)",
    description: "Double points on marquee fixtures",
  },
  { id: "WC", label: "Wildcard (WC)", description: "Unlimited free transfers for a gameweek" },
  { id: "FH", label: "Free Hit (FH)", description: "Temporary squad overhaul for one week" },
  { id: "BB", label: "Bench Boost (BB)", description: "Points count from reserve players" },
];

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

  const set = <K extends keyof LeagueSettingsForm>(key: K, value: LeagueSettingsForm[K]) =>
    setForm((current) => ({ ...current, [key]: value }));

  // Helper to toggle a chip inside the enabled_chips JSON array
  const toggleChip = (chipId: string) => {
    try {
      const currentList: string[] = JSON.parse(form.enabled_chips || "[]");
      const updated = currentList.includes(chipId)
        ? currentList.filter((c) => c !== chipId)
        : [...currentList, chipId];
      set("enabled_chips", JSON.stringify(updated));
    } catch {
      set("enabled_chips", JSON.stringify([chipId]));
    }
  };

  const isChipEnabled = (chipId: string) => {
    try {
      const list: string[] = JSON.parse(form.enabled_chips || "[]");
      return Array.isArray(list) && list.includes(chipId);
    } catch {
      return false;
    }
  };

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

  return (
    <>
      <PanelTitle
        eyebrow="Profile configuration"
        title={asText(profile.name)}
        description="These parameters control budget, roster limits, chips, and points calculations for this profile."
      />

      <form onSubmit={save} className="grid max-w-7xl gap-6">
        {/* Card 1: Budget & Roster Limits */}
        <Card className="border-border/70 bg-card">
          <CardHeader>
            <div className="flex items-center gap-2 text-primary">
              <Coins className="size-5" />
              <CardTitle className="text-base">Purse & squad dimensions</CardTitle>
            </div>
            <CardDescription>
              Set the financial ceiling and roster boundaries enforced during auctions and waivers.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <div className="grid gap-2">
              <Label htmlFor="starting_budget" className="text-xs text-muted-foreground">
                Starting budget
              </Label>
              <Input
                id="starting_budget"
                type="number"
                min="0"
                value={form.starting_budget}
                onChange={(e) => set("starting_budget", e.target.value)}
                className="bg-secondary/60 font-mono"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="roster_min" className="text-xs text-muted-foreground">
                Minimum squad size
              </Label>
              <Input
                id="roster_min"
                type="number"
                min="1"
                max="18"
                value={form.roster_min}
                onChange={(e) => set("roster_min", e.target.value)}
                className="bg-secondary/60 font-mono"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="roster_max" className="text-xs text-muted-foreground">
                Maximum squad size
              </Label>
              <Input
                id="roster_max"
                type="number"
                min="1"
                max="18"
                value={form.roster_max}
                onChange={(e) => set("roster_max", e.target.value)}
                className="bg-secondary/60 font-mono"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="weight_tolerance" className="text-xs text-muted-foreground">
                Trade tolerance
              </Label>
              <Input
                id="weight_tolerance"
                type="number"
                min="0"
                step="0.1"
                value={form.weight_trade_tolerance}
                onChange={(e) => set("weight_trade_tolerance", e.target.value)}
                className="bg-secondary/60 font-mono"
              />
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Scoring & Weight Rules */}
        <Card className="border-border/70 bg-card">
          <CardHeader>
            <div className="flex items-center gap-2 text-primary">
              <UserCheck className="size-5" />
              <CardTitle className="text-base">Scoring & trade logic</CardTitle>
            </div>
            <CardDescription>
              Toggle behavioral constraints that affect gameweek leaderboard point calculations and
              trade validations.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex items-center justify-between rounded-lg border border-border bg-secondary/50 p-4">
              <div className="space-y-0.5 pr-4">
                <Label htmlFor="weight-system" className="text-sm font-medium">
                  Weight system
                </Label>
                <p className="text-xs text-muted-foreground">
                  Enforces Area 51 tier weights and balance ratio across trades
                </p>
              </div>
              <Switch
                id="weight-system"
                checked={form.weight_enabled}
                onCheckedChange={(checked) => set("weight_enabled", checked)}
              />
            </div>

            <div className="flex items-center justify-between rounded-lg border border-border bg-secondary/50 p-4">
              <div className="space-y-0.5 pr-4">
                <Label htmlFor="allow-negatives" className="text-sm font-medium">
                  Allow negative points
                </Label>
                <p className="text-xs text-muted-foreground">
                  When off, duck dismissal and economy penalties floor at zero
                </p>
              </div>
              <Switch
                id="allow-negatives"
                checked={form.allow_negative_points}
                onCheckedChange={(checked) => set("allow_negative_points", checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Card 3: Chips & Release Cycles */}
        <Card className="border-border/70 bg-card">
          <CardHeader>
            <div className="flex items-center gap-2 text-primary">
              <Sparkles className="size-5" />
              <CardTitle className="text-base">Special chips & release cycles</CardTitle>
            </div>
            <CardDescription>
              Select active tactical chips available to team managers this season.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div>
              <Label className="mb-2.5 block text-xs font-medium text-muted-foreground">
                Active chips (click to toggle)
              </Label>
              <div className="flex flex-wrap gap-2.5">
                {AVAILABLE_CHIPS.map((chip) => {
                  const active = isChipEnabled(chip.id);
                  return (
                    <button
                      key={chip.id}
                      type="button"
                      onClick={() => toggleChip(chip.id)}
                      className={`group flex items-center gap-2 rounded-lg border px-3 py-2 text-left transition-[background-color,border-color,color] duration-150 ${
                        active
                          ? "border-[var(--green-border)] bg-[var(--green-bg)] text-[var(--green)]"
                          : "border-border bg-secondary/60 text-muted-foreground hover:border-input hover:bg-secondary hover:text-foreground"
                      }`}
                    >
                      <Badge variant={active ? "default" : "outline"} className="font-mono text-xs">
                        {chip.id}
                      </Badge>
                      <div>
                        <span className="block text-xs font-medium">{chip.label}</span>
                        <span className="block text-[11px] text-muted-foreground/80">
                          {chip.description}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="enabled-chips-json" className="text-xs text-muted-foreground">
                  Chips JSON array
                </Label>
                <Textarea
                  id="enabled-chips-json"
                  rows={2}
                  value={form.enabled_chips}
                  onChange={(e) => set("enabled_chips", e.target.value)}
                  className="bg-secondary/60 font-mono text-xs"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="release-cycles-json" className="text-xs text-muted-foreground">
                  Release cycles JSON array
                </Label>
                <Textarea
                  id="release-cycles-json"
                  rows={2}
                  value={form.release_cycles}
                  onChange={(e) => set("release_cycles", e.target.value)}
                  className="bg-secondary/60 font-mono text-xs"
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end border-t border-border/50 pt-4">
            <Button type="submit" disabled={saving} className="gap-2">
              {saving ? <Loader2 className="size-4 animate-spin" /> : <Check className="size-4" />}
              {saving ? "Saving…" : "Save profile settings"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </>
  );
}
