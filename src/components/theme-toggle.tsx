import { Check, Laptop, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ThemeToggle() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="icon-button" aria-hidden="true">
        <Moon size={16} strokeWidth={1.75} />
      </div>
    );
  }

  const isLight = resolvedTheme === "light";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="icon-button" title="Appearance theme" aria-label="Appearance theme">
          {isLight ? (
            <Sun size={16} strokeWidth={1.75} aria-hidden="true" />
          ) : (
            <Moon size={16} strokeWidth={1.75} aria-hidden="true" />
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40 bg-popover text-popover-foreground">
        <DropdownMenuItem
          onClick={() => setTheme("dark")}
          className="flex items-center justify-between gap-2 text-xs"
        >
          <span className="flex items-center gap-2">
            <Moon size={14} strokeWidth={1.75} className="text-muted-foreground" />
            Dark
          </span>
          {theme === "dark" && <Check size={14} className="text-primary" />}
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => setTheme("light")}
          className="flex items-center justify-between gap-2 text-xs"
        >
          <span className="flex items-center gap-2">
            <Sun size={14} strokeWidth={1.75} className="text-muted-foreground" />
            Light
          </span>
          {theme === "light" && <Check size={14} className="text-primary" />}
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => setTheme("system")}
          className="flex items-center justify-between gap-2 text-xs"
        >
          <span className="flex items-center gap-2">
            <Laptop size={14} strokeWidth={1.75} className="text-muted-foreground" />
            System
          </span>
          {theme === "system" && <Check size={14} className="text-primary" />}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
