import { apiClient } from "@/lib/api-client";
import type { LoginResponse } from "./types";

export const authApi = {
  login: (username: string, password: string) =>
    apiClient.post<LoginResponse>("/api/auth/login", { username, password }),
};
