export type Rol = "ADMINISTRADOR" | "VETERINARIO" | "RECEPCIONISTA";

export interface UsuarioSesion {
  id: number;
  username: string;
  nombre: string;
  apellidoPaterno: string;
  rol: Rol;
}

export interface LoginResponse {
  token: string;
  usuario: UsuarioSesion;
}
