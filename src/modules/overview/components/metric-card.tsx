import { cn } from "cn";
import { ArrowUpRight, type Users } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export function MetricCard({
  label,
  value,
  icon: Icon,
  caption,
  loading = false,
  attention = false,
  onClick,
}: {
  label: string;
  value: string | number;
  icon: typeof Users;
  caption: string;
  loading?: boolean;
  attention?: boolean;
  onClick?: () => void;
}) {
  const className = cn("metric-card", attention && "has-attention");
  const content = (
    <>
      <div className="metric-top">
        <span>{label}</span>
        <span className="metric-icon" aria-hidden="true">
          <Icon size={15} strokeWidth={1.75} />
        </span>
      </div>
      {loading ? (
        <>
          <Skeleton className="my-2.5 h-8 w-24" />
          <Skeleton className="h-4 w-2/3" />
        </>
      ) : (
        <>
          <strong>{value}</strong>
          <div className="metric-foot">
            <small>{caption}</small>
            {onClick && (
              <ArrowUpRight
                size={14}
                strokeWidth={1.75}
                className="metric-link-hint"
                aria-hidden="true"
              />
            )}
          </div>
        </>
      )}
    </>
  );

  if (onClick) {
    return (
      <button type="button" className={className} onClick={onClick}>
        {content}
      </button>
    );
  }

  return <article className={className}>{content}</article>;
}
