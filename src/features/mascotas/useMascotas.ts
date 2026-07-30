import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { mascotasApi } from "./api";
import type { NuevaMascotaInput } from "./types";

export function useMascotas() {
  return useQuery({
    queryKey: ["mascotas"],
    queryFn: async () => (await mascotasApi.listar()).mascotas,
  });
}

export function useBuscarMascotasPorCi(ci: string | undefined) {
  return useQuery({
    queryKey: ["mascotas", "buscar", ci],
    queryFn: async () => (await mascotasApi.buscarPorCiPropietario(ci!)).mascotas,
    enabled: !!ci,
  });
}

export function useCrearMascota() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: NuevaMascotaInput) => mascotasApi.crear(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mascotas"] });
      toast.success("Mascota registrada correctamente");
    },
    onError: (error: Error) => toast.error(error.message),
  });
}
