import type { Propietario } from "@/features/mascotas/types";

export interface PropietarioConMascotas extends Propietario {
  cantidadMascotas: number;
}

export interface ActualizarPropietarioInput {
  nombre?: string;
  apellidoPaterno?: string;
  telefono?: string;
  direccion?: string;
}
