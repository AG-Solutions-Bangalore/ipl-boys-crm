import { useTheme } from "next-themes";
import { Toaster } from "react-hot-toast";

export function AppToaster() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme !== "light";
  const iconSecondary = isDark ? "#17181d" : "#ffffff";

  return (
    <Toaster
      position="bottom-right"
      gutter={10}
      containerStyle={{ zIndex: 80 }}
      toastOptions={{
        duration: 4200,
        style: {
          background: "var(--surface)",
          color: "var(--text-primary)",
          border: "1px solid var(--line-strong)",
          borderRadius: "16px",
          boxShadow: "var(--shadow-elevated)",
          padding: "10px 14px",
          fontSize: "13px",
          fontWeight: 500,
          fontFamily: "inherit",
          maxWidth: "420px",
        },
        success: {
          iconTheme: {
            primary: isDark ? "#34d399" : "#059669",
            secondary: iconSecondary,
          },
        },
        error: {
          iconTheme: {
            primary: isDark ? "#f87171" : "#dc2626",
            secondary: iconSecondary,
          },
        },
        loading: {
          iconTheme: {
            primary: isDark ? "#a1a1aa" : "#52525b",
            secondary: iconSecondary,
          },
        },
      }}
    />
  );
}
