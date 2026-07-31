import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { atencionesApi } from "./api";
import type { NuevaAtencionInput } from "./types";

export function useHistorialAtenciones(mascotaId: number | undefined) {
  return useQuery({
    queryKey: ["atenciones", "historial", mascotaId],
    queryFn: async () => (await atencionesApi.historialDeMascota(mascotaId!)).atenciones,
    enabled: !!mascotaId,
  });
}

export function useCrearAtencion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: NuevaAtencionInput) => atencionesApi.crear(input),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["atenciones", "historial", variables.mascotaId] });
      queryClient.invalidateQueries({ queryKey: ["pagos", "pendientes"] });
      // También afecta la ficha de mascota (peso actual + línea de tiempo unificada).
      queryClient.invalidateQueries({ queryKey: ["mascotas"] });
      toast.success("Atención registrada. Queda disponible para cobro en Pagos.");
    },
    onError: (error: Error) => toast.error(error.message),
  });
}
