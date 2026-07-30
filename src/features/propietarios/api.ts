import { apiClient } from "@/lib/api-client";
import type { Propietario } from "@/features/mascotas/types";

export const propietariosApi = {
  buscarPorCi: (ci: string) => apiClient.get<{ propietario: Propietario | null }>(`/api/propietarios/buscar?ci=${encodeURIComponent(ci)}`),
};
