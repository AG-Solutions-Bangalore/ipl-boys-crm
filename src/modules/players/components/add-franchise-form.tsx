import { useState, type FormEvent } from "react";
import { useCreateFranchise } from "@/modules/players/hooks/use-players";
import type { FranchiseFormValues } from "@/modules/players/types/player.types";
import { useAppFeedback } from "@/shared/context/feedback-context";

const emptyFranchise = (): FranchiseFormValues => ({
  id: "",
  name: "",
  short: "",
  color: "#1D4ED8",
});

export function AddFranchiseForm({ onClose }: { onClose: () => void }) {
  const createFranchise = useCreateFranchise();
  const { notify } = useAppFeedback();
  const [saving, setSaving] = useState(false);
  const [franchise, setFranchise] = useState<FranchiseFormValues>(emptyFranchise);

  const addFranchise = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    try {
      await createFranchise.mutateAsync({
        id: franchise.id.trim().toLowerCase(),
        name: franchise.name,
        short: franchise.short.toUpperCase(),
        color: franchise.color,
        wins: 0,
        losses: 0,
        match_results: [],
      });
      setFranchise(emptyFranchise());
      onClose();
      notify("IPL franchise added.");
    } catch (err) {
      notify(`Could not add franchise: ${(err as Error).message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="panel add-form" onSubmit={addFranchise}>
      <h3>New IPL franchise</h3>
      <label>
        Short ID
        <input
          required
          placeholder="csk"
          value={franchise.id}
          onChange={(e) => setFranchise({ ...franchise, id: e.target.value })}
        />
      </label>
      <label>
        Team name
        <input
          required
          value={franchise.name}
          onChange={(e) => setFranchise({ ...franchise, name: e.target.value })}
        />
      </label>
      <label>
        Short name
        <input
          required
          maxLength={20}
          value={franchise.short}
          onChange={(e) => setFranchise({ ...franchise, short: e.target.value })}
        />
      </label>
      <label>
        Color
        <input
          type="color"
          value={franchise.color}
          onChange={(e) => setFranchise({ ...franchise, color: e.target.value })}
        />
      </label>
      <div className="flex items-center gap-2.5">
        <button className="primary" disabled={saving}>
          {saving ? "Adding…" : "Save franchise"}
        </button>
        <button type="button" className="secondary" onClick={onClose}>
          Cancel
        </button>
      </div>
    </form>
  );
}
