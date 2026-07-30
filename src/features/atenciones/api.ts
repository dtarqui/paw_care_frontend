import { apiClient } from "@/lib/api-client";
import type { AtencionMedica, NuevaAtencionInput } from "./types";

export const atencionesApi = {
  historialDeMascota: (mascotaId: number) =>
    apiClient.get<{ atenciones: AtencionMedica[] }>(`/api/mascotas/${mascotaId}/atenciones`),
  crear: (input: NuevaAtencionInput) => apiClient.post<{ atencion: AtencionMedica }>("/api/atenciones", input),
};
