import { apiClient } from "@/lib/api-client";
import type { Vet } from "./types";

export const vetsApi = {
  list: (activeOnly = false) => apiClient.get<{ vets: Vet[] }>(`/api/vets${activeOnly ? "?active=true" : ""}`),
};
