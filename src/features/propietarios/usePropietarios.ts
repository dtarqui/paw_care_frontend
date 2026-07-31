import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { propietariosApi } from "./api";
import type { ActualizarPropietarioInput } from "./types";

export function usePropietarioPorCi(ci: string | undefined) {
  return useQuery({
    queryKey: ["propietarios", "buscar", ci],
    queryFn: async () => (await propietariosApi.buscarPorCi(ci!)).propietario,
    enabled: !!ci && ci.length >= 5,
  });
}

export function usePropietarios() {
  return useQuery({
    queryKey: ["propietarios"],
    queryFn: async () => (await propietariosApi.listar()).propietarios,
  });
}

export function useActualizarPropietario() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: ActualizarPropietarioInput }) => propietariosApi.actualizar(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["propietarios"] });
      queryClient.invalidateQueries({ queryKey: ["mascotas"] });
      toast.success("Propietario actualizado correctamente");
    },
    onError: (error: Error) => toast.error(error.message),
  });
}
