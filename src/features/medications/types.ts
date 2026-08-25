export interface Medication {
  id: number;
  name: string;
  currentStock: number;
  minimumStock: number;
}

export interface NewMedicationInput {
  name: string;
  minimumStock: number;
  initialStock?: number;
}

export interface UpdateMedicationInput {
  name?: string;
  minimumStock?: number;
}
