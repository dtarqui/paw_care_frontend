import { apiClient } from "@/lib/api-client";
import type { ResultadoImportacion } from "./types";

export const importacionesApi = {
  clientes: (archivo: File) => {
    const formData = new FormData();
    formData.append("archivo", archivo);
    return apiClient.postForm<ResultadoImportacion>("/api/importaciones/clientes", formData);
  },
};
