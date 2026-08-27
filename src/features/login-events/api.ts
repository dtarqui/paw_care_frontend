import { apiClient } from "@/lib/api-client";
import type { LoginEvent, LoginEventFilter } from "./types";

export interface LoginEventListResponse {
  events: LoginEvent[];
  total: number;
  page: number;
  pageSize: number;
  /** Ingresos y fallos de las últimas 24 horas. */
  summary: { successes: number; failures: number };
}

export const loginEventsApi = {
  list: (page = 1, pageSize = 20, outcome: LoginEventFilter = "all", username = "") => {
    const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });
    if (outcome !== "all") params.set("outcome", outcome);
    if (username.trim()) params.set("username", username.trim());
    return apiClient.get<LoginEventListResponse>(`/api/login-events?${params}`);
  },
};
