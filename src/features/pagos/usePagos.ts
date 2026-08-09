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

export function useHistorialPagos(limit = 5) {
  return useQuery({
    queryKey: ["pagos", "historial", limit],
    queryFn: async () => (await pagosApi.historial(limit)).pagos,
  });
}

export function useRegistrarPago() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ atencionId, metodoPago, monto }: { atencionId: number; metodoPago: MetodoPago; monto: number }) =>
      pagosApi.registrar(atencionId, metodoPago, monto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pagos"] });
      toast.success("Pago registrado correctamente");
    },
    onError: (error: Error) => toast.error(error.message),
  });
}

export function useGenerarCobroQr() {
  return useMutation({
    mutationFn: (atencionId: number) => pagosApi.generarCobroQr(atencionId),
  });
}

/** Consulta el estado de un cobro QR, reintentando cada 3s mientras siga PENDIENTE
 * (no hay websockets en el proyecto — ver docs/MEJORAS_PRODUCTO.md sección 5) y
 * se detiene sola al confirmarse/expirar/fallar. El caller (CobroQrDialog) es quien
 * invalida ["pagos", "pendientes"/"historial"] al ver que llegó a CONFIRMADO. */
export function useCobroQr(id: number | null) {
  return useQuery({
    queryKey: ["pagos", "qr", id],
    queryFn: async () => (await pagosApi.consultarCobroQr(id!)).cobro,
    enabled: id !== null,
    refetchInterval: (query) => (query.state.data?.estado === "PENDIENTE" ? 3000 : false),
  });
}
