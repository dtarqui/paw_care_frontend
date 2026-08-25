import { apiClient } from "@/lib/api-client";
import type { LoginResponse } from "./types";

export const authApi = {
  login: (username: string, password: string) =>
    apiClient.post<LoginResponse>("/api/auth/login", { username, password }),
  requestPasswordRecovery: (username: string) =>
    apiClient.post<{ ok: boolean; message: string }>("/api/auth/forgot-password", { username }),
  resetWithToken: (token: string, newPassword: string) =>
    apiClient.post<{ ok: boolean }>("/api/auth/reset-password", { token, newPassword }),
};
