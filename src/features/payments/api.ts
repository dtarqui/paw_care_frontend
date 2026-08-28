import { paperQuery } from "@/features/print/paperSize";
import { apiClient } from "@/lib/api-client";
import type { PaymentHistoryEntry, PaymentMethod, PaymentReceipt, PendingPayment, QrCharge } from "./types";

export const paymentsApi = {
  listPending: () => apiClient.get<{ pending: PendingPayment[] }>("/api/payments/pending"),

  history: (limit = 5) => apiClient.get<{ payments: PaymentHistoryEntry[] }>(`/api/payments/history?limit=${limit}`),

  register: (visitId: number, method: PaymentMethod, amount: number) =>
    apiClient.post<{ payment: PaymentReceipt }>("/api/payments", { visitId, method, amount }),

  /** El PDF del comprobante, en el tamaño de papel configurado en este dispositivo.
   * El backend decide el nombre del archivo, ya traducido; lo de acá es solo el
   * respaldo por si ese header no llegara. */
  downloadReceipt: (payment: { id: number; receiptNumber: string }) =>
    apiClient.download(`/api/payments/${payment.id}/receipt${paperQuery()}`, `${payment.receiptNumber}.pdf`),

  generateQrCharge: (visitId: number) => apiClient.post<{ charge: QrCharge }>("/api/payments/qr", { visitId }),

  getQrCharge: (id: number) => apiClient.get<{ charge: QrCharge }>(`/api/payments/qr/${id}`),
};
