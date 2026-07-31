import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { mascotasApi } from "./api";
import type { ActualizarMascotaInput, NuevaMascotaInput } from "./types";

export function useMascotas(page = 1, pageSize = 20, incluirInactivas = false) {
  return useQuery({
    queryKey: ["mascotas", "listado", page, pageSize, incluirInactivas],
    queryFn: () => mascotasApi.listar(page, pageSize, incluirInactivas),
  });
}

export function useMascota(id: number) {
  return useQuery({
    queryKey: ["mascotas", id],
    queryFn: async () => (await mascotasApi.detalle(id)).mascota,
  });
}

export function useHistorialMascota(id: number) {
  return useQuery({
    queryKey: ["mascotas", id, "historial"],
    queryFn: async () => (await mascotasApi.historial(id)).eventos,
  });
}

export function useActualizarMascota(id: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: ActualizarMascotaInput) => mascotasApi.actualizar(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mascotas"] });
      queryClient.invalidateQueries({ queryKey: ["mascotas", id, "historial"] });
      toast.success("Mascota actualizada correctamente");
    },
    onError: (error: Error) => toast.error(error.message),
  });
}

export function useCambiarEstadoMascota(id: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (estado: "ACTIVO" | "INACTIVO") => mascotasApi.cambiarEstado(id, estado),
    onSuccess: (_data, estado) => {
      queryClient.invalidateQueries({ queryKey: ["mascotas"] });
      toast.success(estado === "ACTIVO" ? "Mascota reactivada" : "Mascota eliminada");
    },
    onError: (error: Error) => toast.error(error.message),
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
