import { apiClient } from "@/lib/api-client";
import type {
  AceptarInvitacionInput,
  CambiarRolInput,
  DatosInvitacion,
  InvitacionPendiente,
  InvitarVeterinarioInput,
  NuevoUsuarioInput,
  PreregistroVeterinarioInput,
  Usuario,
} from "./types";

export interface ListadoUsuarios {
  usuarios: Usuario[];
  total: number;
  page: number;
  pageSize: number;
}

export const usuariosApi = {
  listar: (page = 1, pageSize = 20) => apiClient.get<ListadoUsuarios>(`/api/usuarios?page=${page}&pageSize=${pageSize}`),
  crear: (input: NuevoUsuarioInput) => apiClient.post<{ usuario: Usuario }>("/api/usuarios", input),
  cambiarEstado: (id: number, estado: "ACTIVO" | "INACTIVO") =>
    apiClient.patch<{ usuario: Usuario }>(`/api/usuarios/${id}/estado`, { estado }),
  cambiarRol: (id: number, input: CambiarRolInput) =>
    apiClient.patch<{ usuario: Usuario }>(`/api/usuarios/${id}/rol`, input),
  preregistrarVeterinario: (input: PreregistroVeterinarioInput) =>
    apiClient.post<{ usuario: Usuario }>("/api/usuarios/preregistro", input),
  cambiarMiPassword: (passwordActual: string, passwordNuevo: string) =>
    apiClient.patch<{ ok: boolean }>("/api/usuarios/me/password", { passwordActual, passwordNuevo }),
  restablecerPassword: (id: number, passwordNuevo: string) =>
    apiClient.patch<{ ok: boolean }>(`/api/usuarios/${id}/password`, { passwordNuevo }),
  invitar: (input: InvitarVeterinarioInput) => apiClient.post<{ ok: boolean }>("/api/usuarios/invitaciones", input),
  listarInvitaciones: () => apiClient.get<{ invitaciones: InvitacionPendiente[] }>("/api/usuarios/invitaciones"),
  cancelarInvitacion: (id: number) => apiClient.delete<void>(`/api/usuarios/invitaciones/${id}`),
  validarInvitacion: (token: string) => apiClient.get<DatosInvitacion>(`/api/usuarios/invitaciones/validar/${token}`),
  aceptarInvitacion: (token: string, input: AceptarInvitacionInput) =>
    apiClient.post<{ usuario: Usuario }>(`/api/usuarios/invitaciones/aceptar/${token}`, input),
};
