import { apiClient } from "@/lib/api-client";
import type { BloqueDisponibilidad, Cita, EstadoCita } from "./types";

export const citasApi = {
  listar: () => apiClient.get<{ citas: Cita[] }>("/api/citas"),

  disponibilidad: (veterinarioId: number, fecha: string) =>
    apiClient.get<{ bloques: BloqueDisponibilidad[] }>(
      `/api/citas/disponibilidad?veterinarioId=${veterinarioId}&fecha=${fecha}`
    ),

  cambiarEstado: (id: number, estado: EstadoCita) =>
    apiClient.patch<{ cita: Cita }>(`/api/citas/${id}/estado`, { estado }),

  crear: (input: NuevaCitaInput) => apiClient.post<{ cita: Cita }>("/api/citas", input),

  reprogramar: (id: number, input: { fecha: string; hora: string }) =>
    apiClient.put<{ cita: Cita }>(`/api/citas/${id}`, input),
};

export interface NuevaCitaInput {
  mascotaId: number;
  veterinarioId: number;
  fecha: string;
  hora: string;
  tipoConsulta: string;
  motivo: string;
  duracionMin?: number;
}
