import axios from "axios";
import { readToken } from "@/lib/storage";

const API_BASE = (
  import.meta.env.DEV
    ? "/api"
    : import.meta.env.VITE_API_BASE_URL || "https://agsdemo.in/iplboysapi/public/api"
).replace(/\/+$/, "");

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export const http = axios.create({
  baseURL: API_BASE,
  headers: { Accept: "application/json" },
});

http.interceptors.request.use((config) => {
  const token = readToken();
  if (token) config.headers.set("Authorization", `Bearer ${token}`);
  return config;
});

http.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isAxiosError(error)) {
      const data = error.response?.data as { error?: string; message?: string } | undefined;
      const status = error.response?.status ?? 0;
      const message =
        data?.error ||
        data?.message ||
        (status ? `Request failed (${status})` : error.message || "Network request failed");
      return Promise.reject(new ApiError(message, status));
    }
    return Promise.reject(error instanceof Error ? error : new ApiError("Request failed", 0));
  },
);
