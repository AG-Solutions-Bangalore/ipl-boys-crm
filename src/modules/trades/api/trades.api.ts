import type { Trade } from "@/modules/trades/types/trade.types";
import { tableApi } from "@/shared/api/table.api";

export const tradesApi = {
  list: (profileId: string) =>
    tableApi.list<Trade>("trades", {
      profile_id: profileId,
      order: "created_at.desc",
      limit: "200",
    }),
  execute: (tradeId: string) => tableApi.rpc("execute_trade", { trade_id: tradeId }),
  cancel: (tradeId: string) => tableApi.rpc("admin_cancel_trade", { trade_id: tradeId }),
};
