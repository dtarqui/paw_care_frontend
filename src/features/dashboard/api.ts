import { apiClient } from "@/lib/api-client";
import type { ModuloDashboard } from "./types";

export const dashboardApi = {
  modulos: () => apiClient.get<{ modulos: ModuloDashboard[] }>("/api/dashboard/modulos"),
};
