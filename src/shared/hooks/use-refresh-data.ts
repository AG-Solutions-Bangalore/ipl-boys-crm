import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

export function useRefreshData() {
  const queryClient = useQueryClient();
  return useCallback(() => {
    queryClient.invalidateQueries();
  }, [queryClient]);
}
