export type EstadoPagoAtencion = "PENDIENTE" | "PAGADO";

export interface AtencionMedica {
  id: number;
  mascota: { id: number; nombre: string; especie: string };
  veterinario: { id: number; nombre: string; apellidoPaterno: string };
  fecha: string;
  tipoServicio: string;
  diagnostico: string;
  tratamiento: string;
  examenesExternos?: string;
  peso?: number;
  montoConsulta: number;
  estadoPago: EstadoPagoAtencion;
}

export interface NuevaAtencionInput {
  mascotaId: number;
  veterinarioId: number;
  tipoServicio: string;
  diagnostico: string;
  tratamiento: string;
  examenesExternos?: string;
  peso?: number;
  montoConsulta: number;
  medicamentos?: { medicamentoId: number; cantidad: number }[];
}
