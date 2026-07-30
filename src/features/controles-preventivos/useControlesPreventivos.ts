import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { controlesPreventivosApi } from "./api";
import type { NuevoControlInput } from "./types";

export function useHistorialPreventivo(mascotaId: number | undefined) {
  return useQuery({
    queryKey: ["controles-preventivos", "historial", mascotaId],
    queryFn: async () => (await controlesPreventivosApi.historialDeMascota(mascotaId!)).controles,
    enabled: !!mascotaId,
  });
}

export function useProximosAVencer(dias = 30) {
  return useQuery({
    queryKey: ["controles-preventivos", "proximos-a-vencer", dias],
    queryFn: async () => (await controlesPreventivosApi.proximosAVencer(dias)).controles,
  });
}

export function useCrearControlPreventivo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: NuevoControlInput) => controlesPreventivosApi.crear(input),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["controles-preventivos", "historial", variables.mascotaId] });
      queryClient.invalidateQueries({ queryKey: ["controles-preventivos", "proximos-a-vencer"] });
      toast.success("Control preventivo registrado");
    },
    onError: (error: Error) => toast.error(error.message),
  });
}
