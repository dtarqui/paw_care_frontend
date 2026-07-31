import type { Rol } from "@/features/auth/types";

export interface Usuario {
  id: number;
  username: string;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno?: string;
  ci: string;
  telefono?: string;
  rol: Rol;
  estado: "ACTIVO" | "INACTIVO";
}

export interface NuevoUsuarioInput {
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno?: string;
  ci: string;
  username: string;
  telefono?: string;
  rol: Rol;
  password: string;
  matricula?: string;
  especialidad?: string;
}

export interface CambiarRolInput {
  rol: Rol;
  matricula?: string;
  especialidad?: string;
}
