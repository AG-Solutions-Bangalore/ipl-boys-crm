const API_BASE = (
  import.meta.env.VITE_API_BASE_URL ||
  "https://agsdemo.in/iplboysapi/public/api"
).replace(/\/+$/, "");
const TOKEN_KEY = "fantasy_world_admin_token";

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
  }
}

export function readToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}
export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  headers.set("Accept", "application/json");
  if (init.body) headers.set("Content-Type", "application/json");
  const token = readToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);
  const response = await fetch(`${API_BASE}${path}`, { ...init, headers });
  const body = await response.json().catch(() => ({}));
  if (!response.ok)
    throw new ApiError(
      body.error || body.message || `Request failed (${response.status})`,
      response.status,
    );
  return body as T;
}

export const api = {
  login: (email: string, password: string) =>
    request<{ user: User; session: { access_token: string } }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
  currentUser: () => request<{ user: User }>("/auth/user"),
  profiles: () => request<Row[]>("/auth/profiles"),
  logout: () => request("/auth/logout", { method: "POST" }),
  list: <T = Row>(table: string, params: Record<string, string> = {}) => {
    const query = new URLSearchParams(params);
    return request<T[]>(`/data/${table}${query.size ? `?${query}` : ""}`);
  },
  insert: (table: string, row: Row) =>
    request(`/data/${table}`, { method: "POST", body: JSON.stringify(row) }),
  update: (table: string, id: string, row: Row) =>
    request(`/data/${table}?eq[id]=${encodeURIComponent(id)}`, {
      method: "PATCH",
      body: JSON.stringify(row),
    }),
  remove: (table: string, id: string) =>
    request(`/data/${table}?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    }),
  rpc: (name: string, args: Row) =>
    request(`/rpc/${name}`, { method: "POST", body: JSON.stringify(args) }),
  recalculate: (profile_id: string, gameweek_id: string) =>
    request("/functions/recalculate-gw", {
      method: "POST",
      body: JSON.stringify({ profile_id, gameweek_id }),
    }),
};

export type Row = Record<string, unknown> & { id?: string; name?: string };
export type User = {
  id: string;
  email: string;
  approved: boolean;
  roles: string[];
  profile_id: string;
  user_metadata?: { display_name?: string };
};
