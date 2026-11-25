import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useSession } from "@/modules/auth/hooks/use-session";

export function AppAdminRoute({ children }: { children: ReactNode }) {
  const { isAppAdmin } = useSession();
  if (!isAppAdmin) return <Navigate to="/overview" replace />;
  return <>{children}</>;
}
