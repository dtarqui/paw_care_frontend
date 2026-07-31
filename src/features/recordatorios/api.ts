import { apiClient } from "@/lib/api-client";
import type { RecordatorioEnviado, RecordatorioPendiente } from "./types";

export const recordatoriosApi = {
  pendientes: () => apiClient.get<{ recordatorios: RecordatorioPendiente[] }>("/api/recordatorios/pendientes"),
  historial: (limit = 5) => apiClient.get<{ enviados: RecordatorioEnviado[] }>(`/api/recordatorios/historial?limit=${limit}`),
  marcarEnviado: (id: string) => apiClient.post<{ ok: boolean }>(`/api/recordatorios/${encodeURIComponent(id)}/marcar-enviado`),
};
