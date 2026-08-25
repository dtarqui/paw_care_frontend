export interface RowWithError {
  row: number;
  reason: string;
}

export interface ImportResult {
  imported: number;
  errors: RowWithError[];
}
