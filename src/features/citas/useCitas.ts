import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { citasApi, type NuevaCitaInput } from "./api";
import type { EstadoCita } from "./types";

export function useCitas() {
  return useQuery({
    queryKey: ["citas"],
    queryFn: async () => (await citasApi.listar()).citas,
  });
}

export function useDisponibilidad(veterinarioId: number | undefined, fecha: string | undefined) {
  return useQuery({
    queryKey: ["citas", "disponibilidad", veterinarioId, fecha],
    queryFn: async () => (await citasApi.disponibilidad(veterinarioId!, fecha!)).bloques,
    enabled: !!veterinarioId && !!fecha,
  });
}

export function useCambiarEstadoCita() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, estado }: { id: number; estado: EstadoCita }) => citasApi.cambiarEstado(id, estado),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["citas"] });
      toast.success("Estado de la cita actualizado");
    },
    onError: (error: Error) => toast.error(error.message),
  });
}

export function useCrearCita() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: NuevaCitaInput) => citasApi.crear(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["citas"] });
      toast.success("Cita agendada correctamente");
    },
    onError: (error: Error) => toast.error(error.message),
  });
}

export function useReprogramarCita() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, fecha, hora }: { id: number; fecha: string; hora: string }) =>
      citasApi.reprogramar(id, { fecha, hora }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["citas"] });
      toast.success("Cita reprogramada correctamente");
    },
    onError: (error: Error) => toast.error(error.message),
  });
}
