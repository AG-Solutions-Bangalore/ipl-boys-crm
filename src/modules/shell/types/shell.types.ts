import type { LayoutDashboard } from "lucide-react";

export type NavigationItem = {
  path: string;
  label: string;
  icon: typeof LayoutDashboard;
  color?: string;
  appAdminOnly?: boolean;
};
