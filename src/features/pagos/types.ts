export type MetodoPago = "EFECTIVO" | "TARJETA" | "TRANSFERENCIA" | "QR";

export interface PagoPendiente {
  atencionId: number;
  mascota: { id: number; nombre: string };
  propietario: { id: number; nombre: string; apellidoPaterno: string };
  motivoConsulta: string;
  monto: number;
  fecha: string;
}
