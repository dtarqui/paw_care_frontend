import { apiClient } from "@/lib/api-client";
import type { RegistroAuditoria } from "./types";

export interface ListadoAuditoria {
  registros: RegistroAuditoria[];
  total: number;
  page: number;
  pageSize: number;
}

export const auditoriaApi = {
  listar: (page = 1, pageSize = 20) => apiClient.get<ListadoAuditoria>(`/api/auditoria?page=${page}&pageSize=${pageSize}`),
};
