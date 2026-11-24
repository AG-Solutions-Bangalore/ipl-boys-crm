import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";
import { queryKeys } from "@/lib/query-keys";
import { tableApi } from "@/shared/api/table.api";
import type { QueryParams, Row } from "@/shared/types/common.types";

export function useRows<T extends Row = Row>(
  table: string,
  params: QueryParams = {},
  fetcher?: () => Promise<T[]>,
) {
  const queryClient = useQueryClient();
  const paramsKey = useMemo(() => JSON.stringify(params), [params]);
  const stableParams = useMemo(() => JSON.parse(paramsKey) as QueryParams, [paramsKey]);
  const queryKey = useMemo(() => queryKeys.rows(table, stableParams), [table, stableParams]);
  const query = useQuery({
    queryKey,
    queryFn: () => (fetcher ? fetcher() : tableApi.list<T>(table, stableParams)),
    placeholderData: (previous) => previous,
  });
  const setRows = useCallback(
    (updater: T[] | ((rows: T[]) => T[])) => {
      queryClient.setQueryData<T[]>(queryKey, (current = []) =>
        typeof updater === "function" ? (updater as (rows: T[]) => T[])(current) : updater,
      );
    },
    [queryClient, queryKey],
  );
  return {
    rows: query.data ?? [],
    loading: query.isLoading,
    error: query.error instanceof Error ? query.error.message : "",
    setRows,
  };
}
