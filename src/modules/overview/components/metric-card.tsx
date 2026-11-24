import type { Users } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export function MetricCard({
  label,
  value,
  icon: Icon,
  caption,
  loading = false,
}: {
  label: string;
  value: string | number;
  icon: typeof Users;
  caption: string;
  loading?: boolean;
}) {
  return (
    <article className="metric-card">
      <div className="metric-top">
        <span>{label}</span>
        <Icon size={16} strokeWidth={1.5} aria-hidden="true" />
      </div>
      {loading ? (
        <>
          <Skeleton className="h-8 w-24" />
          <Skeleton className="mt-1 h-4 w-1/3" />
        </>
      ) : (
        <>
          <strong>{value}</strong>
          <small>{caption}</small>
        </>
      )}
    </article>
  );
}
