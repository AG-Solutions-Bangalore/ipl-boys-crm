import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { tradesApi } from "@/modules/trades/api/trades.api";
import type { Trade } from "@/modules/trades/types/trade.types";
import { useRows } from "@/shared/hooks/use-rows";

export function useTrades(profileId: string) {
  const fetcher = useCallback(() => tradesApi.list(profileId), [profileId]);
  return useRows<Trade>(
    "trades",
    { profile_id: profileId, order: "created_at.desc", limit: "200" },
    fetcher,
  );
}

export function useExecuteTrade() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (tradeId: string) => tradesApi.execute(tradeId),
    onSuccess: () => queryClient.invalidateQueries(),
  });
}

export function useCancelTrade() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (tradeId: string) => tradesApi.cancel(tradeId),
    onSuccess: () => queryClient.invalidateQueries(),
  });
}
