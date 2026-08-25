import { useQuery } from "@tanstack/react-query";
import { auditLogsApi } from "./api";

export function useAuditLogs(page = 1, pageSize = 20) {
  return useQuery({
    queryKey: ["audit-logs", "list", page, pageSize],
    queryFn: () => auditLogsApi.list(page, pageSize),
  });
}
