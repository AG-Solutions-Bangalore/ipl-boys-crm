import type { ManagerAssignment, ManagerProfile } from "@/modules/managers/types/manager.types";
import type { FantasyTeam } from "@/modules/teams/types/team.types";
import { tableApi } from "@/shared/api/table.api";

export const managersApi = {
  listProfiles: () => tableApi.list<ManagerProfile>("profiles", { limit: "500" }),
  listTeams: (profileId: string) =>
    tableApi.list<FantasyTeam>("fpl_teams", {
      profile_id: profileId,
      order: "sort_order.asc",
    }),
  listAssignments: (profileId: string) =>
    tableApi.list<ManagerAssignment>("user_team_assignments", {
      profile_id: profileId,
      limit: "500",
    }),
  assign: (userId: string, profileId: string, teamId: string) =>
    tableApi.rpc("assign_manager_to_team", {
      user_id: userId,
      profile_id: profileId,
      team_id: teamId,
    }),
  removeAssignment: (id: string) => tableApi.remove("user_team_assignments", id),
  resetPassword: (userId: string, password: string) =>
    tableApi.rpc("admin_reset_password", { user_id: userId, password }),
};
