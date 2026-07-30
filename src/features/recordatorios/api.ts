import { apiClient } from "@/lib/api-client";
import type { RecordatorioPendiente } from "./types";

export const recordatoriosApi = {
  pendientes: () => apiClient.get<{ recordatorios: RecordatorioPendiente[] }>("/api/recordatorios/pendientes"),
  marcarEnviado: (id: string) => apiClient.post<{ ok: boolean }>(`/api/recordatorios/${encodeURIComponent(id)}/marcar-enviado`),
};
