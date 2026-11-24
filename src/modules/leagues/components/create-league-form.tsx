import { useState, type FormEvent } from "react";
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
  const { notify } = useAppFeedback();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState("5000");
  const [saving, setSaving] = useState(false);

  const create = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    try {
      await createLeague.mutateAsync({
        id: crypto.randomUUID(),
        name,
        description,
        user_id: userId,
        starting_budget: Number(budget),
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
      notify("League profile created.");
    } catch (err) {
      notify(`Could not create league: ${(err as Error).message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="panel add-form" onSubmit={create}>
      <h3>{profileCount ? "Add another league profile" : "Create the first league profile"}</h3>
      <label>
        Profile name
        <input required value={name} onChange={(e) => setName(e.target.value)} />
      </label>
      <label>
        Description
        <input value={description} onChange={(e) => setDescription(e.target.value)} />
      </label>
      <label>
        Starting team budget
        <input type="number" min="0" value={budget} onChange={(e) => setBudget(e.target.value)} />
      </label>
      <button className="primary" disabled={saving || !name.trim()}>
        {saving ? "Creating…" : "Create league"}
      </button>
    </form>
  );
}
