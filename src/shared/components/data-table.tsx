import type { ReactNode } from "react";
import { asText, isTrue } from "@/lib/format";
import type { Row } from "@/shared/types/common.types";
import { Skeleton } from "@/components/ui/skeleton";

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
              <tr key={i} className="loading-row">
                {columns.map(() => (
                  <td key={i}>
                    <Skeleton className="h-5 w-3/4" />
                  </td>
                ))}
                {actions && <td><Skeleton className="h-5 w-1/3" /></td>}
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
                {columns.map((c) => (
                  <td key={c.key}>
                    {c.key === "approved" || c.key === "is_locked" || c.key === "is_active" ? (
                      <span className={isTrue(row[c.key]) ? "badge green" : "badge amber"}>
                        {isTrue(row[c.key]) ? "Yes" : "No"}
                      </span>
                    ) : (
                      asText(row[c.key]) || "—"
                    )}
                  </td>
                ))}
                {actions && <td>{actions(row)}</td>}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
