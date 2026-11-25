import { useEffect, useState, type FormEvent } from "react";
import { asText, isTrue } from "@/lib/format";
import {
  useAssignManager,
  useManagerAssignments,
  useManagerProfiles,
  useManagerTeams,
  useRemoveAssignment,
  useResetPassword,
} from "@/modules/managers/hooks/use-managers";
import type { ManagerAssignment } from "@/modules/managers/types/manager.types";
import { useAdminContext } from "@/modules/shell/context/admin-context";
import { DataTable } from "@/shared/components/data-table";
import { PanelTitle } from "@/shared/components/panel-title";
import { useAppFeedback } from "@/shared/context/feedback-context";

export function ManagersPage() {
  const { profileId } = useAdminContext();
  const users = useManagerProfiles();
  const teams = useManagerTeams(profileId);
  const assignments = useManagerAssignments(profileId);
  const assignManager = useAssignManager();
  const removeAssignment = useRemoveAssignment();
  const resetPassword = useResetPassword();
  const { notify, showError } = useAppFeedback();
  const [userId, setUserId] = useState("");
  const [teamId, setTeamId] = useState("");
  const [busy, setBusy] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const approvedUsers = users.rows.filter((user) => isTrue(user.approved));

  useEffect(() => {
    if (!userId && approvedUsers[0]?.user_id) setUserId(String(approvedUsers[0].user_id));
    if (!teamId && teams.rows[0]?.id) setTeamId(String(teams.rows[0].id));
  }, [approvedUsers, teams.rows, userId, teamId]);

  const save = async (event: FormEvent) => {
    event.preventDefault();
    if (!profileId || !userId || !teamId) return;
    setBusy(userId);
    try {
      const current = assignments.rows.find((row) => String(row.user_id) === userId);
      if (current && String(current.team_id) === teamId) {
        showError("This manager is already assigned to that team.");
        return;
      }
      await assignManager.mutateAsync({ userId, profileId, teamId });
      notify("Manager assigned to the selected team.");
    } catch (err) {
      showError(`Assignment failed: ${(err as Error).message}`);
    } finally {
      setBusy("");
    }
  };

  const remove = async (row: ManagerAssignment) => {
    if (!row.id) return;
    setBusy(String(row.id));
    try {
      await removeAssignment.mutateAsync(String(row.id));
      notify("Manager assignment removed.");
    } catch (err) {
      showError((err as Error).message);
    } finally {
      setBusy("");
    }
  };

  const reset = async (event: FormEvent) => {
    event.preventDefault();
    if (!userId) return;
    setBusy("password");
    try {
      await resetPassword.mutateAsync({ userId, password: newPassword });
      setNewPassword("");
      notify(
        "Password reset. Share the temporary password with the manager through your usual private channel.",
      );
    } catch (err) {
      showError(`Password reset failed: ${(err as Error).message}`);
    } finally {
      setBusy("");
    }
  };

  const userName = (id: unknown) => {
    const item = users.rows.find((user) => String(user.user_id) === String(id));
    return asText(item?.display_name) || asText(item?.email) || String(id || "—");
  };

  const teamName = (id: unknown) =>
    asText(teams.rows.find((team) => String(team.id) === String(id))?.name) || String(id || "—");

  return (
    <>
      <PanelTitle
        eyebrow="Account access"
        title="Manager assignments"
        description="Approve manager signups, then connect each approved account to one fantasy team in the selected league."
      />
      <form className="panel add-form" onSubmit={save}>
        <div className="form-head">
          <h3>Assign manager to team</h3>
        </div>
        <label>
          Approved manager
          <select required value={userId} onChange={(e) => setUserId(e.target.value)}>
            <option value="">Choose a manager</option>
            {approvedUsers.map((user) => (
              <option key={String(user.user_id)} value={String(user.user_id)}>
                {asText(user.display_name) || asText(user.email)} · {asText(user.email)}
              </option>
            ))}
          </select>
        </label>
        <label>
          Fantasy team
          <select required value={teamId} onChange={(e) => setTeamId(e.target.value)}>
            <option value="">Choose a team</option>
            {teams.rows.map((team) => (
              <option key={String(team.id)} value={String(team.id)}>
                {asText(team.name)}
              </option>
            ))}
          </select>
        </label>
        <button
          type="submit"
          className="primary"
          disabled={!userId || !teamId || !!busy || users.loading || teams.loading}
        >
          Assign manager
        </button>
      </form>
      <form className="panel add-form" onSubmit={reset}>
        <div className="form-head">
          <h3>Reset manager password</h3>
        </div>
        <label>
          Approved account
          <select required value={userId} onChange={(e) => setUserId(e.target.value)}>
            <option value="">Choose an approved manager</option>
            {approvedUsers.map((user) => (
              <option key={String(user.user_id)} value={String(user.user_id)}>
                {asText(user.email)}
              </option>
            ))}
          </select>
        </label>
        <label>
          Temporary password
          <input
            required
            minLength={8}
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </label>
        <button
          type="submit"
          className="secondary"
          disabled={!userId || newPassword.length < 8 || !!busy}
        >
          Reset password
        </button>
      </form>
      <div className="panel">
        <div className="panel-head">
          <h3>Current assignments</h3>
          <span className="mini-tag">One manager per league</span>
        </div>
        <DataTable
          rows={assignments.rows.map((row) => ({
            ...row,
            manager: userName(row.user_id),
            team: teamName(row.team_id),
          }))}
          loading={assignments.loading}
          columns={[
            { key: "manager", label: "Manager" },
            { key: "team", label: "Fantasy team" },
            { key: "created_at", label: "Assigned" },
          ]}
          actions={(row) => (
            <button
              className="text-button"
              disabled={busy === row.id}
              onClick={() => remove(row as ManagerAssignment)}
            >
              Remove
            </button>
          )}
        />
      </div>
    </>
  );
}
