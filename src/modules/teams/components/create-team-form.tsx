import { useEffect, useState, type FormEvent } from "react";
import { asText } from "@/lib/format";
import { useCreateTeam } from "@/modules/teams/hooks/use-teams";
import type { Franchise, TeamFormValues } from "@/modules/teams/types/team.types";
import { useAppFeedback } from "@/shared/context/feedback-context";

export function CreateTeamForm({
  profileId,
  franchises,
  startingBudget,
  sortOrder,
  onClose,
}: {
  profileId: string;
  franchises: Franchise[];
  startingBudget: number;
  sortOrder: number;
  onClose: () => void;
}) {
  const createTeam = useCreateTeam();
  const { notify } = useAppFeedback();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<TeamFormValues>({
    name: "",
    owner: "",
    budget: "5000",
    ipl_team_id: "",
  });

  useEffect(() => {
    if (!form.ipl_team_id && franchises[0]?.id)
      setForm((current) => ({ ...current, ipl_team_id: String(franchises[0].id) }));
    if (form.budget === "5000" && startingBudget !== 5000)
      setForm((current) => ({ ...current, budget: String(startingBudget) }));
  }, [franchises, form.ipl_team_id, form.budget, startingBudget]);

  const add = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    try {
      await createTeam.mutateAsync({
        id: crypto.randomUUID(),
        profile_id: profileId,
        name: form.name,
        owner: form.owner,
        budget: Number(form.budget),
        ipl_team_id: form.ipl_team_id,
        starting_xi: [],
        substitutes: [],
        chips: {},
        sort_order: sortOrder,
        created_at: new Date().toISOString(),
      });
      setForm({
        name: "",
        owner: "",
        budget: String(startingBudget),
        ipl_team_id: franchises[0]?.id ? String(franchises[0].id) : "",
      });
      onClose();
      notify("Fantasy team created. Assign its manager from Managers & teams.");
    } catch (err) {
      notify(`Could not create team: ${(err as Error).message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="panel add-form" onSubmit={add}>
      <label>
        Team name
        <input
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
      </label>
      <label>
        Manager display name
        <input value={form.owner} onChange={(e) => setForm({ ...form, owner: e.target.value })} />
      </label>
      <label>
        Starting budget
        <input
          type="number"
          min="0"
          value={form.budget}
          onChange={(e) => setForm({ ...form, budget: e.target.value })}
        />
      </label>
      <label>
        IPL franchise
        <select
          value={form.ipl_team_id}
          onChange={(e) => setForm({ ...form, ipl_team_id: e.target.value })}
        >
          <option value="">None</option>
          {franchises.map((team) => (
            <option key={String(team.id)} value={String(team.id)}>
              {asText(team.name)}
            </option>
          ))}
        </select>
      </label>
      <button className="primary" disabled={saving || !profileId}>
        {saving ? "Creating…" : "Create fantasy team"}
      </button>
    </form>
  );
}
