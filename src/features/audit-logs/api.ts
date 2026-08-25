import { apiClient } from "@/lib/api-client";
import type { AuditLog } from "./types";

export interface AuditLogListResponse {
  logs: AuditLog[];
  total: number;
  page: number;
  pageSize: number;
}

export const auditLogsApi = {
  list: (page = 1, pageSize = 20) =>
    apiClient.get<AuditLogListResponse>(`/api/audit-logs?page=${page}&pageSize=${pageSize}`),
};
