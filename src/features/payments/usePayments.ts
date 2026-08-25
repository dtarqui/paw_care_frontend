import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { paymentsApi } from "./api";
import type { PaymentMethod } from "./types";

export function usePendingPayments() {
  return useQuery({
    queryKey: ["payments", "pending"],
    queryFn: async () => (await paymentsApi.listPending()).pending,
  });
}

export function usePaymentHistory(limit = 5) {
  return useQuery({
    queryKey: ["payments", "history", limit],
    queryFn: async () => (await paymentsApi.history(limit)).payments,
  });
}

export function useRegisterPayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ visitId, method, amount }: { visitId: number; method: PaymentMethod; amount: number }) =>
      paymentsApi.register(visitId, method, amount),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      toast.success("Pago registrado correctamente");
    },
    onError: (error: Error) => toast.error(error.message),
  });
}

export function useGenerateQrCharge() {
  return useMutation({
    mutationFn: (visitId: number) => paymentsApi.generateQrCharge(visitId),
  });
}

/** Consulta el estado de un cobro QR, reintentando cada 3s mientras siga PENDING
 * (no hay websockets en el proyecto — ver docs/MEJORAS_PRODUCTO.md sección 5) y
 * se detiene sola al confirmarse/expirar/fallar. El caller (QrChargeDialog) es quien
 * invalida ["payments", "pending"/"history"] al ver que llegó a CONFIRMED. */
export function useQrCharge(id: number | null) {
  return useQuery({
    queryKey: ["payments", "qr", id],
    queryFn: async () => (await paymentsApi.getQrCharge(id!)).charge,
    enabled: id !== null,
    refetchInterval: (query) => (query.state.data?.status === "PENDING" ? 3000 : false),
  });
}
