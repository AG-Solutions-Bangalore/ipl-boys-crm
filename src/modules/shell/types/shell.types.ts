import type { LayoutDashboard } from "lucide-react";

export type NavigationSection = "Operations" | "League & catalog";

export type NavigationItem = {
  path: string;
  label: string;
  icon: typeof LayoutDashboard;
  section: NavigationSection;
  accent: string;
  appAdminOnly?: boolean;
};
