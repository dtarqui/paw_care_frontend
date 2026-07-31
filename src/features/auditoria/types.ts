export type AccionAuditoria = "ACTIVAR_CUENTA" | "DESACTIVAR_CUENTA" | "RESTABLECER_PASSWORD" | "CAMBIAR_ROL" | "INVITAR_VETERINARIO";

export interface RegistroAuditoria {
  id: number;
  actor?: { nombre: string; apellidoPaterno: string };
  accion: AccionAuditoria;
  entidadTipo: string;
  entidadId?: number;
  detalle?: string;
  fecha: string;
}
