import { apiClient } from "@/lib/api-client";
import type { NuevoUsuarioInput, Usuario } from "./types";

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
};
