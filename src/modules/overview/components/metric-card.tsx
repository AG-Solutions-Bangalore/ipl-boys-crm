import type { Users } from "lucide-react";

export function MetricCard({
  label,
  value,
  icon: Icon,
  caption,
}: {
  label: string;
  value: string | number;
  icon: typeof Users;
  caption: string;
}) {
  return (
    <article className="metric-card">
      <div className="metric-top">
        <span>{label}</span>
        <Icon size={16} strokeWidth={1.5} aria-hidden="true" />
      </div>
      <strong>{value}</strong>
      <small>{caption}</small>
    </article>
  );
}
