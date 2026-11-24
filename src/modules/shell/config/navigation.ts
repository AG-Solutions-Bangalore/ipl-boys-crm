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
  { path: "/overview", label: "Overview", icon: LayoutDashboard, color: "#38bdf8" },
  { path: "/approvals", label: "Approvals", icon: BadgeCheck, color: "#fbbf24", appAdminOnly: true },
  { path: "/managers", label: "Managers & teams", icon: Users, color: "#818cf8", appAdminOnly: true },
  { path: "/leagues", label: "League settings", icon: Shield, color: "#34d399" },
  { path: "/teams", label: "Fantasy teams", icon: Users, color: "#a78bfa" },
  { path: "/players", label: "Player pool", icon: Activity, color: "#fb7185" },
  { path: "/auction", label: "Auction desk", icon: Gavel, color: "#e7b85c" },
  { path: "/gameweeks", label: "Gameweeks", icon: Clock3, color: "#2dd4bf" },
  { path: "/scores", label: "Scores", icon: CircleDollarSign, color: "#a3e635" },
  { path: "/trades", label: "Trades", icon: Swords, color: "#fb923c" },
  { path: "/activity", label: "Activity log", icon: Database, color: "#94a3b8" },
];
