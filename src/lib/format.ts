export const asText = (value: unknown): string =>
  value == null ? "" : typeof value === "object" ? JSON.stringify(value) : String(value);

export const isTrue = (value: unknown): boolean =>
  value === true || value === 1 || value === "1" || value === "true";
