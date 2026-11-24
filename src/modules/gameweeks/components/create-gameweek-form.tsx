import { useState, type FormEvent } from "react";
import { useCreateGameweek } from "@/modules/gameweeks/hooks/use-gameweeks";
import type { GameweekFormValues } from "@/modules/gameweeks/types/gameweek.types";
import { useAppFeedback } from "@/shared/context/feedback-context";

export function CreateGameweekForm({
  nextNumber,
  onClose,
}: {
  nextNumber: number;
  onClose: () => void;
}) {
  const createGameweek = useCreateGameweek();
  const { notify } = useAppFeedback();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<GameweekFormValues>({
    name: `Gameweek ${nextNumber}`,
    deadline: "",
    game_count: "1",
  });

  const add = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    try {
      const id = `gw${nextNumber}`;
      const deadline = form.deadline.replace("T", " ") + ":00";
      await createGameweek.mutateAsync({
        id,
        name: form.name,
        number: nextNumber,
        deadline,
        lock_time: deadline,
        game_count: Number(form.game_count),
        is_active: false,
        is_locked: false,
        is_complete: false,
      });
      setForm({
        name: `Gameweek ${nextNumber + 1}`,
        deadline: "",
        game_count: "1",
      });
      onClose();
      notify("Gameweek created.");
    } catch (err) {
      notify((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="panel add-form" onSubmit={add}>
      <label>
        Week name
        <input
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
      </label>
      <label>
        Deadline
        <input
          required
          type="datetime-local"
          value={form.deadline}
          onChange={(e) => setForm({ ...form, deadline: e.target.value })}
        />
      </label>
      <label>
        Match count
        <input
          min="1"
          type="number"
          value={form.game_count}
          onChange={(e) => setForm({ ...form, game_count: e.target.value })}
        />
      </label>
      <button className="primary" disabled={saving}>
        {saving ? "Creating…" : "Create week"}
      </button>
    </form>
  );
}
