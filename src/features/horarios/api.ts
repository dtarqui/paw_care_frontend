import { apiClient } from "@/lib/api-client";
import type { BloqueHorarioInput, Horario } from "./types";

export const horariosApi = {
  listar: (veterinarioId: number) => apiClient.get<{ horarios: Horario[] }>(`/api/veterinarios/${veterinarioId}/horarios`),
  actualizar: (veterinarioId: number, horarios: BloqueHorarioInput[]) =>
    apiClient.put<{ horarios: Horario[] }>(`/api/veterinarios/${veterinarioId}/horarios`, { horarios }),
};
