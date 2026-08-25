export type AppointmentStatus = "CONFIRMED" | "ATTENDED" | "CANCELLED";

export interface Appointment {
  id: number;
  code: string;
  dateTime: string;
  durationMin: number;
  pet: { id: number; name: string; species: string };
  vet: { id: number; firstName: string; paternalLastName: string };
  consultationType: string;
  reason: string;
  status: AppointmentStatus;
}

export interface AvailabilitySlot {
  time: string;
  available: boolean;
}
