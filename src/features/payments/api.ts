import { apiClient } from "@/lib/api-client";
import type { PaymentHistoryEntry, PaymentMethod, PendingPayment, QrCharge } from "./types";

export const paymentsApi = {
  listPending: () => apiClient.get<{ pending: PendingPayment[] }>("/api/payments/pending"),

  history: (limit = 5) => apiClient.get<{ payments: PaymentHistoryEntry[] }>(`/api/payments/history?limit=${limit}`),

  register: (visitId: number, method: PaymentMethod, amount: number) =>
    apiClient.post("/api/payments", { visitId, method, amount }),

  generateQrCharge: (visitId: number) => apiClient.post<{ charge: QrCharge }>("/api/payments/qr", { visitId }),

  getQrCharge: (id: number) => apiClient.get<{ charge: QrCharge }>(`/api/payments/qr/${id}`),
};
