export type PaymentMethod = "CASH" | "CARD" | "TRANSFER" | "QR";

export interface PendingPayment {
  visitId: number;
  pet: { id: number; name: string };
  owner: { id: number; firstName: string; paternalLastName: string };
  consultationReason: string;
  amount: number;
  date: string;
}

export interface PaymentHistoryEntry {
  id: number;
  visitId: number;
  pet: { id: number; name: string };
  owner: { id: number; firstName: string; paternalLastName: string };
  method: PaymentMethod;
  amount: number;
  date: string;
}

/** El comprobante que devuelve el alta de un pago y alimenta la pantalla de éxito. */
export interface PaymentReceipt {
  id: number;
  /** Número visible, ej. `R-2026-000042`. Es un identificador: no cambia con el idioma. */
  receiptNumber: string;
  date: string;
  method: PaymentMethod;
  amount: number;
  pet: { id: number; name: string; species: string };
  owner: { id: number; firstName: string; paternalLastName: string; nationalId: string; phone?: string };
  visit: { id: number; serviceType: string; diagnosis: string; date: string };
  vet: { firstName: string; paternalLastName: string };
}

export type QrChargeStatus = "PENDING" | "CONFIRMED" | "EXPIRED" | "ERROR";

export interface QrCharge {
  id: number;
  visitId: number;
  amount: number;
  status: QrChargeStatus;
  provider: string;
  qrPayload?: string;
  expiresAt?: string;
  confirmedAt?: string;
  createdAt: string;
}
