export type MetodoPago = "EFECTIVO" | "TARJETA" | "TRANSFERENCIA" | "QR";

export interface FiltrosReporte {
  desde?: string;
  hasta?: string;
  tipoServicio?: string;
  metodoPago?: MetodoPago;
}

export interface PagoDetalle {
  id: number;
  atencionId: number;
  metodoPago: MetodoPago;
  monto: number;
  fecha: string;
  tipoServicio: string;
  mascota: string;
  propietario: string;
}

export interface ReporteIngresos {
  pagos: PagoDetalle[];
  totales: { cantidad: number; monto: number };
}

export interface AtencionResumen {
  id: number;
  fecha: string;
  mascota: string;
  propietario: string;
  veterinario: string;
  tipoServicio: string;
  montoConsulta: number;
  estadoPago: string;
}

export interface GrupoPorServicio {
  tipoServicio: string;
  cantidad: number;
  monto: number;
}
