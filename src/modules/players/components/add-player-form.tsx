import { useState, type FormEvent } from "react";
import { asText } from "@/lib/format";
import { useCreatePlayer } from "@/modules/players/hooks/use-players";
import type { PlayerFormValues } from "@/modules/players/types/player.types";
import type { Franchise } from "@/modules/teams/types/team.types";
import { useAppFeedback } from "@/shared/context/feedback-context";

export function AddPlayerForm({
  franchises,
  franchiseLoading,
  onClose,
}: {
  franchises: Franchise[];
  franchiseLoading: boolean;
  onClose: () => void;
}) {
  const createPlayer = useCreatePlayer();
  const { notify } = useAppFeedback();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<PlayerFormValues>({
    name: "",
    role: "BAT",
    ipl_team_id: "",
    tier: "glass",
    weight: "0",
    base_price: "10",
  });

  const add = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    try {
      await createPlayer.mutateAsync({
        id: `p${Date.now()}`,
        name: form.name,
        role: form.role,
        ipl_team_id: form.ipl_team_id,
        tier: form.tier,
        weight: Number(form.weight),
        base_price: Number(form.base_price),
      });
      setForm({ ...form, name: "" });
      onClose();
      notify("Player added to the catalog.");
    } catch (err) {
      notify((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="panel add-form" onSubmit={add}>
      <label>
        Player name
        <input
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
      </label>
      <label>
        Role
        <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
          <option>BAT</option>
          <option>WK</option>
          <option>BOWL</option>
          <option>AR</option>
          <option>TEAM</option>
        </select>
      </label>
      <label>
        IPL franchise
        <select
          required
          value={form.ipl_team_id}
          onChange={(e) => setForm({ ...form, ipl_team_id: e.target.value })}
        >
          <option value="">Choose franchise</option>
          {franchises.map((team) => (
            <option key={String(team.id)} value={String(team.id)}>
              {asText(team.name)}
            </option>
          ))}
        </select>
      </label>
      <label>
        Tier
        <select value={form.tier} onChange={(e) => setForm({ ...form, tier: e.target.value })}>
          <option>glass</option>
          <option>bronze</option>
          <option>silver</option>
          <option>gold</option>
          <option>platinum</option>
        </select>
      </label>
      <label>
        Weight
        <input
          type="number"
          min="0"
          max="5"
          value={form.weight}
          onChange={(e) => setForm({ ...form, weight: e.target.value })}
        />
      </label>
      <label>
        Base price
        <input
          type="number"
          min="0"
          value={form.base_price}
          onChange={(e) => setForm({ ...form, base_price: e.target.value })}
        />
      </label>
      <div className="flex items-center gap-2.5">
        <button className="primary" disabled={saving || franchiseLoading || franchises.length === 0}>
          {saving ? "Adding…" : "Save player"}
        </button>
        <button type="button" className="secondary" onClick={onClose}>
          Cancel
        </button>
      </div>
    </form>
  );
}
