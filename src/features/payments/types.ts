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
