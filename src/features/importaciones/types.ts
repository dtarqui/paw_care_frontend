export interface FilaConError {
  fila: number;
  motivo: string;
}

export interface ResultadoImportacion {
  importados: number;
  errores: FilaConError[];
}
