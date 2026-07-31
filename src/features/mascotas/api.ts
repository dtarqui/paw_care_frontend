import { apiClient } from "@/lib/api-client";
import type { ActualizarMascotaInput, EventoHistorialMascota, Mascota, NuevaMascotaInput } from "./types";

export interface ListadoMascotas {
  mascotas: Mascota[];
  total: number;
  page: number;
  pageSize: number;
}

export const mascotasApi = {
  listar: (page = 1, pageSize = 20) => apiClient.get<ListadoMascotas>(`/api/mascotas?page=${page}&pageSize=${pageSize}`),
  buscarPorCiPropietario: (ci: string) => apiClient.get<{ mascotas: Mascota[] }>(`/api/mascotas/buscar?ci=${encodeURIComponent(ci)}`),
  crear: (input: NuevaMascotaInput) => apiClient.post<{ mascota: Mascota }>("/api/mascotas", input),
  detalle: (id: number) => apiClient.get<{ mascota: Mascota }>(`/api/mascotas/${id}`),
  actualizar: (id: number, input: ActualizarMascotaInput) => apiClient.patch<{ mascota: Mascota }>(`/api/mascotas/${id}`, input),
  historial: (id: number) => apiClient.get<{ eventos: EventoHistorialMascota[] }>(`/api/mascotas/${id}/historial`),
};
