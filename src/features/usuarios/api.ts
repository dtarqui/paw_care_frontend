import { apiClient } from "@/lib/api-client";
import type { NuevoUsuarioInput, Usuario } from "./types";

export const usuariosApi = {
  listar: () => apiClient.get<{ usuarios: Usuario[] }>("/api/usuarios"),
  crear: (input: NuevoUsuarioInput) => apiClient.post<{ usuario: Usuario }>("/api/usuarios", input),
};
