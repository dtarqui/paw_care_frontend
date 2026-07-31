import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { usuariosApi } from "./api";
import type {
  AceptarInvitacionInput,
  CambiarRolInput,
  InvitarVeterinarioInput,
  NuevoUsuarioInput,
  PreregistroVeterinarioInput,
} from "./types";

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

export function usePreregistrarVeterinario() {
  return useMutation({
    mutationFn: (input: PreregistroVeterinarioInput) => usuariosApi.preregistrarVeterinario(input),
  });
}

export function useCambiarMiPassword() {
  return useMutation({
    mutationFn: ({ passwordActual, passwordNuevo }: { passwordActual: string; passwordNuevo: string }) =>
      usuariosApi.cambiarMiPassword(passwordActual, passwordNuevo),
    onSuccess: () => toast.success("Contraseña actualizada correctamente"),
    onError: (error: Error) => toast.error(error.message),
  });
}

export function useRestablecerPassword() {
  return useMutation({
    mutationFn: ({ id, passwordNuevo }: { id: number; passwordNuevo: string }) => usuariosApi.restablecerPassword(id, passwordNuevo),
    onSuccess: () => toast.success("Contraseña restablecida correctamente"),
    onError: (error: Error) => toast.error(error.message),
  });
}

export function useInvitacionesPendientes() {
  return useQuery({
    queryKey: ["usuarios", "invitaciones"],
    queryFn: async () => (await usuariosApi.listarInvitaciones()).invitaciones,
  });
}

export function useInvitarVeterinario() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: InvitarVeterinarioInput) => usuariosApi.invitar(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["usuarios", "invitaciones"] });
      toast.success("Invitación enviada correctamente");
    },
    onError: (error: Error) => toast.error(error.message),
  });
}

export function useCancelarInvitacion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => usuariosApi.cancelarInvitacion(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["usuarios", "invitaciones"] });
      toast.success("Invitación cancelada");
    },
    onError: (error: Error) => toast.error(error.message),
  });
}

export function useValidarInvitacion(token: string | undefined) {
  return useQuery({
    queryKey: ["usuarios", "invitaciones", "validar", token],
    queryFn: () => usuariosApi.validarInvitacion(token!),
    enabled: !!token,
    retry: false,
  });
}

export function useAceptarInvitacion() {
  return useMutation({
    mutationFn: ({ token, input }: { token: string; input: AceptarInvitacionInput }) => usuariosApi.aceptarInvitacion(token, input),
  });
}
