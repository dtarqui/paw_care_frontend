import { apiClient } from "@/lib/api-client";
import type { CambiarRolInput, NuevoUsuarioInput, PreregistroVeterinarioInput, Usuario } from "./types";

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
};
