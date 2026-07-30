import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { recordatoriosApi } from "./api";

export function useRecordatoriosPendientes() {
  return useQuery({
    queryKey: ["recordatorios", "pendientes"],
    queryFn: async () => (await recordatoriosApi.pendientes()).recordatorios,
  });
}

export function useMarcarRecordatorioEnviado() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => recordatoriosApi.marcarEnviado(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recordatorios", "pendientes"] });
      toast.success("Recordatorio marcado como enviado");
    },
    onError: (error: Error) => toast.error(error.message),
  });
}
