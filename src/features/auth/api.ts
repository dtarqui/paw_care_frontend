import { apiClient } from "@/lib/api-client";
import type { LoginResponse } from "./types";

export const authApi = {
  login: (username: string, password: string) =>
    apiClient.post<LoginResponse>("/api/auth/login", { username, password }),
  solicitarRecuperacion: (username: string) =>
    apiClient.post<{ ok: boolean; mensaje: string }>("/api/auth/forgot-password", { username }),
  restablecerConToken: (token: string, passwordNuevo: string) =>
    apiClient.post<{ ok: boolean }>("/api/auth/reset-password", { token, passwordNuevo }),
};
