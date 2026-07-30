import { apiClient } from "@/lib/api-client";
import type { Mascota, NuevaMascotaInput } from "./types";

export const mascotasApi = {
  listar: () => apiClient.get<{ mascotas: Mascota[] }>("/api/mascotas"),
  buscarPorCiPropietario: (ci: string) => apiClient.get<{ mascotas: Mascota[] }>(`/api/mascotas/buscar?ci=${encodeURIComponent(ci)}`),
  crear: (input: NuevaMascotaInput) => apiClient.post<{ mascota: Mascota }>("/api/mascotas", input),
};
