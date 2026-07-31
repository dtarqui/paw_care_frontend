import { useQuery } from "@tanstack/react-query";
import { auditoriaApi } from "./api";

export function useAuditoria(page = 1, pageSize = 20) {
  return useQuery({
    queryKey: ["auditoria", "listado", page, pageSize],
    queryFn: () => auditoriaApi.listar(page, pageSize),
  });
}
