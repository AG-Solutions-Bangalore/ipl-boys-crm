import { http } from "@/lib/axios";
import type { QueryParams, Row } from "@/shared/types/common.types";

export const tableApi = {
  list: async <T = Row>(table: string, params: QueryParams = {}): Promise<T[]> => {
    const { data } = await http.get<T[]>(`/data/${table}`, { params });
    return data;
  },
  insert: async (table: string, row: Row): Promise<void> => {
    await http.post(`/data/${table}`, row);
  },
  update: async (table: string, id: string, row: Row): Promise<void> => {
    await http.patch(`/data/${table}`, row, { params: { "eq[id]": id } });
  },
  remove: async (table: string, id: string): Promise<void> => {
    await http.delete(`/data/${table}`, { params: { id } });
  },
  rpc: async <T = unknown>(name: string, args: Row): Promise<T> => {
    const { data } = await http.post<T>(`/rpc/${name}`, args);
    return data;
  },
  recalculate: async (profile_id: string, gameweek_id: string): Promise<void> => {
    await http.post("/functions/recalculate-gw", { profile_id, gameweek_id });
  },
};
