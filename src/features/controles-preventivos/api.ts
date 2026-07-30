import { apiClient } from "@/lib/api-client";
import type { ControlPreventivo, NuevoControlInput } from "./types";

export const controlesPreventivosApi = {
  historialDeMascota: (mascotaId: number) =>
    apiClient.get<{ controles: ControlPreventivo[] }>(`/api/mascotas/${mascotaId}/controles-preventivos`),

  proximosAVencer: (dias = 30) =>
    apiClient.get<{ controles: ControlPreventivo[] }>(`/api/controles-preventivos/proximos-a-vencer?dias=${dias}`),

  crear: (input: NuevoControlInput) => apiClient.post<{ control: ControlPreventivo }>("/api/controles-preventivos", input),
};
