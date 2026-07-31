export type TipoRecordatorio = "CITA" | "CONTROL_PREVENTIVO";

export interface RecordatorioPendiente {
  id: string;
  tipo: TipoRecordatorio;
  propietario: { telefono: string; nombre: string; apellidoPaterno: string };
  mensaje: string;
  referencia: string;
}

export interface RecordatorioEnviado {
  id: number;
  propietario: { nombre: string; apellidoPaterno: string };
  mensaje: string;
  canal: string;
  enviadoEn: string;
}
