export type MetodoPago = "EFECTIVO" | "TARJETA" | "TRANSFERENCIA" | "QR";

export interface PagoPendiente {
  atencionId: number;
  mascota: { id: number; nombre: string };
  propietario: { id: number; nombre: string; apellidoPaterno: string };
  motivoConsulta: string;
  monto: number;
  fecha: string;
}

export interface PagoHistorial {
  id: number;
  atencionId: number;
  mascota: { id: number; nombre: string };
  propietario: { id: number; nombre: string; apellidoPaterno: string };
  metodoPago: MetodoPago;
  monto: number;
  fecha: string;
}

export type EstadoCobroQr = "PENDIENTE" | "CONFIRMADO" | "EXPIRADO" | "ERROR";

export interface CobroQr {
  id: number;
  atencionId: number;
  monto: number;
  estado: EstadoCobroQr;
  proveedor: string;
  qrPayload?: string;
  expiraEn?: string;
  confirmadoEn?: string;
  createdAt: string;
}
