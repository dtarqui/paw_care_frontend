import { apiClient } from "@/lib/api-client";

export const exportacionApi = {
  descargarCompleta: () => apiClient.download("/api/exportacion/completa", "pawcare-exportacion-completa.xlsx"),
};
