import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { auctionApi } from "@/modules/auction/api/auction.api";
import type { PlayerAssignment } from "@/modules/auction/types/auction.types";
import type { Player } from "@/modules/players/types/player.types";
import type { FantasyTeam } from "@/modules/teams/types/team.types";
import { useRows } from "@/shared/hooks/use-rows";

export function useAuctionTeams(profileId: string) {
  const fetcher = useCallback(() => auctionApi.teams(profileId), [profileId]);
  return useRows<FantasyTeam>(
    "fpl_teams",
    { profile_id: profileId, order: "sort_order.asc" },
    fetcher,
  );
}

export function useAuctionPlayers() {
  return useRows<Player>("players", { order: "name.asc", limit: "1000" }, auctionApi.players);
}

export function useAuctionAssignments(profileId: string) {
  const fetcher = useCallback(() => auctionApi.assignments(profileId), [profileId]);
  return useRows<PlayerAssignment>("player_assignments", { profile_id: profileId }, fetcher);
}

export function useExecuteAuctionSale() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      profileId,
      teamId,
      playerId,
      price,
    }: {
      profileId: string;
      teamId: string;
      playerId: string;
      price: number;
    }) => auctionApi.sell(profileId, teamId, playerId, price),
    onSuccess: () => queryClient.invalidateQueries(),
  });
}
