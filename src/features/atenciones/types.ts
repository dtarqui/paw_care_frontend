export type EstadoPagoAtencion = "PENDIENTE" | "PAGADO";

export interface AtencionMedica {
  id: number;
  mascota: { id: number; nombre: string; especie: string };
  veterinario: { id: number; nombre: string; apellidoPaterno: string };
  fecha: string;
  diagnostico: string;
  tratamiento: string;
  examenesExternos?: string;
  montoConsulta: number;
  estadoPago: EstadoPagoAtencion;
}

export interface NuevaAtencionInput {
  mascotaId: number;
  veterinarioId: number;
  diagnostico: string;
  tratamiento: string;
  examenesExternos?: string;
  montoConsulta: number;
}
