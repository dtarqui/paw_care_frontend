export type PaymentMethod = "CASH" | "CARD" | "TRANSFER" | "QR";

export interface ReportFilters {
  from?: string;
  to?: string;
  serviceType?: string;
  paymentMethod?: PaymentMethod;
}

export interface PaymentDetail {
  id: number;
  visitId: number;
  method: PaymentMethod;
  amount: number;
  date: string;
  serviceType: string;
  pet: string;
  owner: string;
}

export interface RevenueReport {
  payments: PaymentDetail[];
  totals: { count: number; amount: number };
}

export interface VisitSummary {
  id: number;
  date: string;
  pet: string;
  owner: string;
  vet: string;
  serviceType: string;
  consultationFee: number;
  paymentStatus: string;
}

export interface ServiceTypeGroup {
  serviceType: string;
  count: number;
  amount: number;
}
