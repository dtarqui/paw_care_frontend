export type TipoControlPreventivo = "VACUNA" | "DESPARASITACION";

export interface ControlPreventivo {
  id: number;
  mascota: { id: number; nombre: string; especie: string };
  tipo: TipoControlPreventivo;
  fechaAplicacion: string;
  proximaDosis: string;
  vencido: boolean;
}

export interface NuevoControlInput {
  mascotaId: number;
  tipo: TipoControlPreventivo;
  fechaAplicacion: string;
  proximaDosis?: string;
}
