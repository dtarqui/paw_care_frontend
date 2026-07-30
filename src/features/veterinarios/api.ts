import { apiClient } from "@/lib/api-client";
import type { Veterinario } from "./types";

export const veterinariosApi = {
  listar: () => apiClient.get<{ veterinarios: Veterinario[] }>("/api/veterinarios"),
};
