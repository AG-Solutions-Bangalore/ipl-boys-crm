import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { queryKeys } from "@/lib/query-keys";
import {
  clearStoredUser,
  clearToken,
  readStoredUser,
  readToken,
  writeStoredUser,
  writeToken,
} from "@/lib/storage";
import { authApi } from "@/modules/auth/api/auth.api";
import type { User } from "@/modules/auth/types/auth.types";

export function hasAdminRole(user: User | null): boolean {
  return !!user?.roles?.some((role) => role === "app_admin" || role === "profile_admin");
}

export function hasAppAdminRole(user: User | null): boolean {
  return !!user?.roles?.includes("app_admin");
}

type SessionContextValue = {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isAppAdmin: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [token, setToken] = useState<string | null>(() => readToken());
  const [user, setUser] = useState<User | null>(() => readStoredUser());

  const currentUserQuery = useQuery({
    queryKey: queryKeys.currentUser,
    queryFn: authApi.currentUser,
    enabled: !!token,
    initialData: readStoredUser() ?? undefined,
    retry: 0,
  });

  useEffect(() => {
    if (!currentUserQuery.data) return;
    setUser(currentUserQuery.data);
    writeStoredUser(currentUserQuery.data);
  }, [currentUserQuery.data]);

  useEffect(() => {
    if (!currentUserQuery.isError || !token) return;
    clearToken();
    clearStoredUser();
    setToken(null);
    setUser(null);
    queryClient.clear();
  }, [currentUserQuery.isError, token, queryClient]);

  const loginMutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      authApi.login(email, password),
  });

  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
  });

  const signIn = async (email: string, password: string) => {
    const result = await loginMutation.mutateAsync({ email, password });
    const loggedIn = result.user;
    writeToken(result.session.access_token);
    writeStoredUser(loggedIn);
    if (!hasAdminRole(loggedIn)) {
      clearToken();
      clearStoredUser();
      throw new Error("This account does not have an administrator role.");
    }
    queryClient.clear();
    queryClient.setQueryData(queryKeys.currentUser, loggedIn);
    setToken(result.session.access_token);
    setUser(loggedIn);
  };

  const signOut = async () => {
    try {
      await logoutMutation.mutateAsync();
    } catch {
      /* Token is removed locally if the server is offline. */
    }
    clearToken();
    clearStoredUser();
    setToken(null);
    setUser(null);
    queryClient.clear();
  };

  const value: SessionContextValue = {
    user,
    isAuthenticated: !!token && !!user,
    isAdmin: hasAdminRole(user),
    isAppAdmin: hasAppAdminRole(user),
    loading: !!token && !user && currentUserQuery.isLoading,
    signIn,
    signOut,
  };

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) throw new Error("useSession must be used inside SessionProvider");
  return context;
}
