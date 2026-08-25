import { apiClient } from "@/lib/api-client";
import type { Appointment, AppointmentStatus, AvailabilitySlot } from "./types";

export const appointmentsApi = {
  // El backend pagina (protege contra crecimiento sin límite), pero la agenda
  // (AppointmentsListTab) agrupa por día y necesita el conjunto completo — pedir una
  // página grande evita truncar silenciosamente un día a la mitad. Si el volumen
  // de citas de la clínica creciera mucho, esta pantalla necesitaría un filtro
  // de rango de fechas antes que paginación real.
  // 100 es el tope máximo que acepta el backend (readPagination) por request.
  list: (pageSize = 100) =>
    apiClient.get<{ appointments: Appointment[]; total: number }>(`/api/appointments?pageSize=${pageSize}`),

  availability: (vetId: number, date: string) =>
    apiClient.get<{ slots: AvailabilitySlot[] }>(`/api/appointments/availability?vetId=${vetId}&date=${date}`),

  changeStatus: (id: number, status: AppointmentStatus) =>
    apiClient.patch<{ appointment: Appointment }>(`/api/appointments/${id}/status`, { status }),

  create: (input: NewAppointmentInput) => apiClient.post<{ appointment: Appointment }>("/api/appointments", input),

  reschedule: (id: number, input: { date: string; time: string }) =>
    apiClient.put<{ appointment: Appointment }>(`/api/appointments/${id}`, input),
};

export interface NewAppointmentInput {
  petId: number;
  vetId: number;
  date: string;
  time: string;
  consultationType: string;
  reason: string;
  durationMin?: number;
}
