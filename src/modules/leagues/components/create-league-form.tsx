import { useState, type FormEvent } from "react";
import { Loader2, Plus, ShieldPlus } from "lucide-react";
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
import { useCreateLeague } from "@/modules/leagues/hooks/use-leagues";
import { useAppFeedback } from "@/shared/context/feedback-context";

export function CreateLeagueForm({
  profileCount,
  userId,
}: {
  profileCount: number;
  userId: string;
}) {
  const createLeague = useCreateLeague();
  const { notify, showError } = useAppFeedback();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState("5000");
  const [saving, setSaving] = useState(false);

  const create = async (event: FormEvent) => {
    event.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    try {
      await createLeague.mutateAsync({
        id: crypto.randomUUID(),
        name: name.trim(),
        description: description.trim(),
        user_id: userId,
        starting_budget: Number(budget) || 5000,
        weight_enabled: false,
        weight_trade_tolerance: 0,
        allow_negative_points: true,
        roster_min: 15,
        roster_max: 18,
        enabled_chips: ["TC", "MMC"],
        release_cycles: ["BWA1", "BWA2"],
        created_at: new Date().toISOString(),
      });
      setName("");
      setDescription("");
      setBudget("5000");
      notify("League profile created.");
    } catch (err) {
      showError(`Could not create league: ${(err as Error).message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="mt-6 border-border/70 bg-card">
      <CardHeader>
        <div className="flex items-center gap-2 text-primary">
          <ShieldPlus className="size-5" />
          <CardTitle className="text-lg">
            {profileCount ? "Add another league profile" : "Create the first league profile"}
          </CardTitle>
        </div>
        <CardDescription>
          Configure a new isolated league environment with its own starting purse, roster caps, and
          scoring rules.
        </CardDescription>
      </CardHeader>
      <form onSubmit={create}>
        <CardContent className="grid gap-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="league-name" className="text-xs text-muted-foreground">
                Profile name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="league-name"
                required
                placeholder="e.g. IPL 2026 Premier"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-secondary/60"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="starting-budget" className="text-xs text-muted-foreground">
                Starting team purse (₹ Cr / Points)
              </Label>
              <Input
                id="starting-budget"
                type="number"
                min="0"
                placeholder="5000"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="bg-secondary/60 font-mono"
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="league-desc" className="text-xs text-muted-foreground">
              Description <span className="text-muted-foreground/60">(optional)</span>
            </Label>
            <Input
              id="league-desc"
              placeholder="e.g. 10-team private auction league with tier weights"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-secondary/60"
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end border-t border-border/50 pt-4">
          <Button type="submit" disabled={saving || !name.trim()} className="gap-2">
            {saving ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
            {saving ? "Creating…" : "Create league"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
