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
  const { notify, showError } = useAppFeedback();
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
      showError(`Could not add franchise: ${(err as Error).message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="panel add-form" onSubmit={addFranchise}>
      <div className="form-head">
        <h3>New IPL franchise</h3>
        <p className="muted">Add a franchise to the auction catalog with its badge color.</p>
      </div>
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
          placeholder="Chennai Super Kings"
          value={franchise.name}
          onChange={(e) => setFranchise({ ...franchise, name: e.target.value })}
        />
      </label>
      <label>
        Short name
        <input
          required
          maxLength={20}
          placeholder="CSK"
          value={franchise.short}
          onChange={(e) => setFranchise({ ...franchise, short: e.target.value })}
        />
      </label>
      <label>
        Franchise color
        <input
          type="color"
          value={franchise.color}
          onChange={(e) => setFranchise({ ...franchise, color: e.target.value })}
        />
      </label>
      <div className="add-form-actions">
        <button type="submit" className="primary" disabled={saving}>
          {saving ? "Adding…" : "Save franchise"}
        </button>
        <button type="button" className="secondary" onClick={onClose}>
          Cancel
        </button>
      </div>
    </form>
  );
}
