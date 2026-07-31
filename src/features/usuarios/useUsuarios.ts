import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { usuariosApi } from "./api";
import type { CambiarRolInput, NuevoUsuarioInput } from "./types";

export function useUsuarios(page = 1, pageSize = 20) {
  return useQuery({
    queryKey: ["usuarios", "listado", page, pageSize],
    queryFn: () => usuariosApi.listar(page, pageSize),
  });
}

export function useCrearUsuario() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: NuevoUsuarioInput) => usuariosApi.crear(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["usuarios"] });
      queryClient.invalidateQueries({ queryKey: ["veterinarios"] });
      toast.success("Usuario registrado correctamente");
    },
    onError: (error: Error) => toast.error(error.message),
  });
}

export function useCambiarRolUsuario() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: CambiarRolInput }) => usuariosApi.cambiarRol(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["usuarios"] });
      queryClient.invalidateQueries({ queryKey: ["veterinarios"] });
      toast.success("Rol actualizado correctamente");
    },
    onError: (error: Error) => toast.error(error.message),
  });
}

export function useCambiarEstadoUsuario() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, estado }: { id: number; estado: "ACTIVO" | "INACTIVO" }) => usuariosApi.cambiarEstado(id, estado),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["usuarios"] });
      queryClient.invalidateQueries({ queryKey: ["veterinarios"] });
      toast.success(variables.estado === "ACTIVO" ? "Usuario activado" : "Usuario desactivado");
    },
    onError: (error: Error) => toast.error(error.message),
  });
}
