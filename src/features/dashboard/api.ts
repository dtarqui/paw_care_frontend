import { apiClient } from "@/lib/api-client";
import type { DashboardModulesResponse } from "./types";

export const dashboardApi = {
  modules: () => apiClient.get<DashboardModulesResponse>("/api/dashboard/modules"),
};
