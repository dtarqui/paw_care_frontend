import { apiClient } from "@/lib/api-client";
import type { DashboardModule } from "./types";

export const dashboardApi = {
  modules: () => apiClient.get<{ modules: DashboardModule[] }>("/api/dashboard/modules"),
};
