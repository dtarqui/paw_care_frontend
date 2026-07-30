export type EstadoCita = "CONFIRMADA" | "ATENDIDA" | "CANCELADA";

export interface Cita {
  id: number;
  codigo: string;
  fechaHora: string;
  duracionMin: number;
  mascota: { id: number; nombre: string; especie: string };
  veterinario: { id: number; nombre: string; apellidoPaterno: string };
  tipoConsulta: string;
  motivo: string;
  estado: EstadoCita;
}

export interface BloqueDisponibilidad {
  hora: string;
  disponible: boolean;
}
