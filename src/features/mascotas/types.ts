import type { AtencionMedica } from "../atenciones/types";
import type { Cita } from "../citas/types";
import type { ControlPreventivo } from "../controles-preventivos/types";

export interface Propietario {
  id: number;
  nombre: string;
  apellidoPaterno: string;
  ci: string;
  telefono: string;
  direccion?: string;
}

export interface Mascota {
  id: number;
  nombre: string;
  especie: string;
  raza: string;
  sexo: "Macho" | "Hembra";
  fechaNacimiento: string;
  peso: number;
  estado: "ACTIVO" | "INACTIVO";
  propietario: Propietario;
}

export interface NuevaMascotaInput {
  nombre: string;
  especie: string;
  raza?: string;
  sexo: "Macho" | "Hembra";
  fechaNacimiento?: string;
  peso?: number;
  propietario: {
    ci: string;
    nombre?: string;
    apellidoPaterno?: string;
    telefono?: string;
  };
}

export interface ActualizarMascotaInput {
  nombre?: string;
  especie?: string;
  raza?: string;
  sexo?: "Macho" | "Hembra";
  fechaNacimiento?: string;
  peso?: number;
}

export interface CambioMascota {
  id: number;
  campo: string;
  valorAnterior?: string;
  valorNuevo?: string;
  fecha: string;
  usuario?: string;
}

// Ficha individual de mascota: línea de tiempo unificada. Espejo exacto de
// EventoHistorialMascota en backend/src/types.ts.
export type EventoHistorialMascota =
  | { tipo: "ATENCION"; fecha: string; atencion: AtencionMedica }
  | { tipo: "CONTROL"; fecha: string; control: ControlPreventivo }
  | { tipo: "CITA"; fecha: string; cita: Cita }
  | { tipo: "CAMBIO"; fecha: string; cambio: CambioMascota };
