import { apiClient } from "@/lib/api-client";
import type { BloqueDisponibilidad, Cita, EstadoCita } from "./types";

export const citasApi = {
  // El backend pagina (protege contra crecimiento sin límite), pero la agenda
  // (CitasListaTab) agrupa por día y necesita el conjunto completo — pedir una
  // página grande evita truncar silenciosamente un día a la mitad. Si el volumen
  // de citas de la clínica creciera mucho, esta pantalla necesitaría un filtro
  // de rango de fechas antes que paginación real.
  // 100 es el tope máximo que acepta el backend (leerPaginacion) por request.
  listar: (pageSize = 100) => apiClient.get<{ citas: Cita[]; total: number }>(`/api/citas?pageSize=${pageSize}`),

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
