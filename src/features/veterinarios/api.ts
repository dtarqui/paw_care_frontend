import { apiClient } from "@/lib/api-client";
import type { Veterinario } from "./types";

export const veterinariosApi = {
  listar: (soloActivos = false) =>
    apiClient.get<{ veterinarios: Veterinario[] }>(`/api/veterinarios${soloActivos ? "?activos=true" : ""}`),
};
