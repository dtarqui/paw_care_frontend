export interface Medicamento {
  id: number;
  nombre: string;
  stockActual: number;
  stockMinimo: number;
}

export interface NuevoMedicamentoInput {
  nombre: string;
  stockMinimo: number;
  stockInicial?: number;
}

export interface ActualizarMedicamentoInput {
  nombre?: string;
  stockMinimo?: number;
}
