import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { horariosApi } from "./api";
import type { BloqueHorarioInput } from "./types";

export function useHorarios(veterinarioId: number | undefined) {
  return useQuery({
    queryKey: ["horarios", veterinarioId],
    queryFn: async () => (await horariosApi.listar(veterinarioId!)).horarios,
    enabled: !!veterinarioId,
  });
}

export function useActualizarHorarios(veterinarioId: number | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (horarios: BloqueHorarioInput[]) => horariosApi.actualizar(veterinarioId!, horarios),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["horarios", veterinarioId] });
      queryClient.invalidateQueries({ queryKey: ["citas", "disponibilidad"] });
      toast.success("Horario actualizado correctamente");
    },
    onError: (error: Error) => toast.error(error.message),
  });
}
