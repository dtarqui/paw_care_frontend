import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { pagosApi } from "./api";
import type { MetodoPago } from "./types";

export function usePagosPendientes() {
  return useQuery({
    queryKey: ["pagos", "pendientes"],
    queryFn: async () => (await pagosApi.listarPendientes()).pendientes,
  });
}

export function useRegistrarPago() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ atencionId, metodoPago, monto }: { atencionId: number; metodoPago: MetodoPago; monto: number }) =>
      pagosApi.registrar(atencionId, metodoPago, monto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pagos", "pendientes"] });
      toast.success("Pago registrado correctamente");
    },
    onError: (error: Error) => toast.error(error.message),
  });
}
