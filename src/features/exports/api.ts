import { apiClient } from "@/lib/api-client";

export const exportsApi = {
  downloadFull: () => apiClient.download("/api/exports/full", "pawcare-exportacion-completa.xlsx"),
};
