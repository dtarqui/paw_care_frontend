import { apiClient } from "@/lib/api-client";
import type { Propietario } from "@/features/mascotas/types";
import type { ActualizarPropietarioInput, PropietarioConMascotas } from "./types";

export const propietariosApi = {
  buscarPorCi: (ci: string) => apiClient.get<{ propietario: Propietario | null }>(`/api/propietarios/buscar?ci=${encodeURIComponent(ci)}`),
  listar: () => apiClient.get<{ propietarios: PropietarioConMascotas[] }>("/api/propietarios"),
  actualizar: (id: number, input: ActualizarPropietarioInput) =>
    apiClient.patch<{ propietario: Propietario }>(`/api/propietarios/${id}`, input),
};
