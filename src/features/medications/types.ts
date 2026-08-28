export interface Medication {
  id: number;
  name: string;
  /** Lo que hay en el estante, vencido incluido. */
  currentStock: number;
  /** Lo utilizable: el total menos los lotes vencidos. Es contra este número que se
   * compara el stock mínimo — una caja vencida ocupa lugar pero no sirve. */
  availableStock: number;
  expiredStock: number;
  minimumStock: number;
  /** El lote no vencido que vence antes, si alguno tiene fecha. */
  nextExpiryOn?: string;
}

export interface MedicationBatch {
  id: number;
  medicationId: number;
  batchNumber?: string;
  expiresOn?: string;
  quantity: number;
  receivedOn: string;
  expired: boolean;
}

export interface ExpiringBatch extends MedicationBatch {
  medicationName: string;
  /** Días que faltan para vencer; negativo si ya venció. */
  daysToExpiry: number;
}

/** Lo que se anota al recibir mercadería. Número de lote y vencimiento son opcionales:
 * hay insumos sin fecha, y exigirla llevaría a inventar una. */
export interface StockEntryInput {
  quantity: number;
  batchNumber?: string;
  expiresOn?: string;
}

export interface NewMedicationInput extends Partial<StockEntryInput> {
  name: string;
  minimumStock: number;
  initialStock?: number;
}

export interface UpdateMedicationInput {
  name?: string;
  minimumStock?: number;
}
