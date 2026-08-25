export type VisitPaymentStatus = "PENDING" | "PAID";

export interface MedicalVisit {
  id: number;
  pet: { id: number; name: string; species: string };
  vet: { id: number; firstName: string; paternalLastName: string };
  date: string;
  serviceType: string;
  diagnosis: string;
  treatment: string;
  externalExams?: string;
  weight?: number;
  consultationFee: number;
  paymentStatus: VisitPaymentStatus;
}

export interface NewVisitInput {
  petId: number;
  vetId: number;
  serviceType: string;
  diagnosis: string;
  treatment: string;
  externalExams?: string;
  weight?: number;
  consultationFee: number;
  medications?: { medicationId: number; quantity: number }[];
}
