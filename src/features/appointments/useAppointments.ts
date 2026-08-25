import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { appointmentsApi, type NewAppointmentInput } from "./api";
import type { AppointmentStatus } from "./types";

export function useAppointments() {
  return useQuery({
    queryKey: ["appointments"],
    queryFn: async () => (await appointmentsApi.list()).appointments,
  });
}

export function useAvailability(vetId: number | undefined, date: string | undefined) {
  return useQuery({
    queryKey: ["appointments", "availability", vetId, date],
    queryFn: async () => (await appointmentsApi.availability(vetId!, date!)).slots,
    enabled: !!vetId && !!date,
  });
}

export function useChangeAppointmentStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: AppointmentStatus }) =>
      appointmentsApi.changeStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      queryClient.invalidateQueries({ queryKey: ["pets"] });
      toast.success("Estado de la cita actualizado");
    },
    onError: (error: Error) => toast.error(error.message),
  });
}

export function useCreateAppointment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: NewAppointmentInput) => appointmentsApi.create(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      queryClient.invalidateQueries({ queryKey: ["pets"] });
      toast.success("Cita agendada correctamente");
    },
    onError: (error: Error) => toast.error(error.message),
  });
}

export function useRescheduleAppointment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, date, time }: { id: number; date: string; time: string }) =>
      appointmentsApi.reschedule(id, { date, time }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      queryClient.invalidateQueries({ queryKey: ["pets"] });
      toast.success("Cita reprogramada correctamente");
    },
    onError: (error: Error) => toast.error(error.message),
  });
}
