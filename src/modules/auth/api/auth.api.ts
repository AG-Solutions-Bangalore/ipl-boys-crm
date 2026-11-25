import { http } from "@/lib/axios";
import type { LoginResponse, User } from "@/modules/auth/types/auth.types";

export const authApi = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const { data } = await http.post<LoginResponse>("/auth/login", { email, password });
    return data;
  },
  currentUser: async (): Promise<User> => {
    const { data } = await http.get<{ user: User }>("/auth/user");
    return data.user;
  },
  logout: async (): Promise<void> => {
    await http.post("/auth/logout");
  },
};
