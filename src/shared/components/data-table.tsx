import type { ReactNode } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { asText, formatDateTime, isTrue } from "@/lib/format";
import type { Row } from "@/shared/types/common.types";

const DATE_KEYS = new Set(["created_at", "deadline", "lock_time"]);

function renderBadge(key: string, value: unknown) {
  if (key === "is_active") {
    const active = isTrue(value);
    return (
      <span className={active ? "badge green" : "badge neutral"}>
        {active ? "Active" : "Inactive"}
      </span>
    );
  }
  if (key === "is_locked") {
    const locked = isTrue(value);
    return (
      <span className={locked ? "badge amber" : "badge green"}>{locked ? "Locked" : "Open"}</span>
    );
  }
  if (key === "approved") {
    const approved = isTrue(value);
    return (
      <span className={approved ? "badge green" : "badge amber"}>
        {approved ? "Approved" : "Pending"}
      </span>
    );
  }
  const status = asText(value).toLowerCase();
  if (status === "accepted" || status === "approved" || status === "completed") {
    return <span className="badge green">{asText(value)}</span>;
  }
  if (status === "pending" || status === "open") {
    return <span className="badge amber">{asText(value)}</span>;
  }
  if (status === "cancelled" || status === "denied" || status === "rejected") {
    return <span className="badge red">{asText(value)}</span>;
  }
  return <span className="badge neutral">{asText(value) || "—"}</span>;
}

export function DataTable({
  rows,
  columns,
  loading,
  empty = "No records found",
  actions,
}: {
  rows: Row[];
  columns: {
    key: string;
    label: string;
  }[];
  loading: boolean;
  empty?: string;
  actions?: (row: Row) => ReactNode;
}) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={c.key}>{c.label}</th>
            ))}
            {actions && <th>Action</th>}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <tr key={`skeleton-${i}`} className="loading-row">
                {columns.map((c) => (
                  <td key={c.key}>
                    <Skeleton className="h-5 w-3/4" />
                  </td>
                ))}
                {actions && (
                  <td>
                    <Skeleton className="h-5 w-16" />
                  </td>
                )}
              </tr>
            ))
          ) : rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length + (actions ? 1 : 0)} className="empty">
                {empty}
              </td>
            </tr>
          ) : (
            rows.map((row, i) => (
              <tr key={String(row.id || i)}>
                {columns.map((c) => {
                  const raw = row[c.key];
                  if (
                    c.key === "approved" ||
                    c.key === "is_locked" ||
                    c.key === "is_active" ||
                    c.key === "status"
                  ) {
                    return <td key={c.key}>{renderBadge(c.key, raw)}</td>;
                  }
                  if (c.key === "color") {
                    const hex = asText(raw);
                    return (
                      <td key={c.key}>
                        {hex ? (
                          <span className="color-swatch-cell">
                            <span
                              className="color-swatch-dot"
                              style={{ backgroundColor: hex }}
                              aria-hidden="true"
                            />
                            {hex}
                          </span>
                        ) : (
                          "—"
                        )}
                      </td>
                    );
                  }
                  if (DATE_KEYS.has(c.key)) {
                    const rawText = asText(raw);
                    return (
                      <td key={c.key} title={rawText || undefined}>
                        {formatDateTime(raw)}
                      </td>
                    );
                  }
                  const text = asText(raw) || "—";
                  return (
                    <td key={c.key} title={text.length > 36 ? text : undefined}>
                      {text}
                    </td>
                  );
                })}
                {actions && <td>{actions(row)}</td>}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
