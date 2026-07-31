import type { Rol } from "@/features/auth/types";

export interface Usuario {
  id: number;
  username: string;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno?: string;
  ci: string;
  email?: string;
  telefono?: string;
  rol: Rol;
  estado: "ACTIVO" | "INACTIVO";
  autorregistrado: boolean;
}

export interface NuevoUsuarioInput {
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno?: string;
  ci: string;
  email?: string;
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

export interface PreregistroVeterinarioInput {
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno?: string;
  ci: string;
  email: string;
  username: string;
  telefono?: string;
  password: string;
  matricula: string;
  especialidad: string;
}

export interface InvitarVeterinarioInput {
  email: string;
  nombre?: string;
}

export interface InvitacionPendiente {
  id: number;
  email: string;
  nombre?: string;
  invitadoPor: { nombre: string; apellidoPaterno: string };
  expiraEn: string;
  createdAt: string;
}

export interface DatosInvitacion {
  email: string;
  nombre?: string;
}

export interface AceptarInvitacionInput {
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno?: string;
  ci: string;
  username: string;
  telefono?: string;
  password: string;
  matricula: string;
  especialidad: string;
}
