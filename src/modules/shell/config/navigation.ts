import {
  Activity,
  BadgeCheck,
  CircleDollarSign,
  Clock3,
  Database,
  Gavel,
  LayoutDashboard,
  Shield,
  Swords,
  Users,
} from "lucide-react";
import type { NavigationItem } from "@/modules/shell/types/shell.types";

export const navigation: NavigationItem[] = [
  { path: "/overview", label: "Overview", icon: LayoutDashboard },
  { path: "/approvals", label: "Approvals", icon: BadgeCheck, appAdminOnly: true },
  { path: "/managers", label: "Managers & teams", icon: Users, appAdminOnly: true },
  { path: "/leagues", label: "League settings", icon: Shield },
  { path: "/teams", label: "Fantasy teams", icon: Users },
  { path: "/players", label: "Player pool", icon: Activity },
  { path: "/auction", label: "Auction desk", icon: Gavel },
  { path: "/gameweeks", label: "Gameweeks", icon: Clock3 },
  { path: "/scores", label: "Scores", icon: CircleDollarSign },
  { path: "/trades", label: "Trades", icon: Swords },
  { path: "/activity", label: "Activity log", icon: Database },
];
