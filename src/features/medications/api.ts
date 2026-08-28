import { apiClient } from "@/lib/api-client";
import type {
  ExpiringBatch,
  Medication,
  MedicationBatch,
  NewMedicationInput,
  StockEntryInput,
  UpdateMedicationInput,
} from "./types";

export const medicationsApi = {
  list: () => apiClient.get<{ medications: Medication[] }>("/api/medications"),
  lowStock: () => apiClient.get<{ medications: Medication[] }>("/api/medications/low-stock"),

  /** Lo vencido y lo que vence dentro de `days`. */
  expiring: (days = 60) => apiClient.get<{ batches: ExpiringBatch[] }>(`/api/medications/expiring?days=${days}`),

  batches: (medicationId: number) =>
    apiClient.get<{ batches: MedicationBatch[] }>(`/api/medications/${medicationId}/batches`),

  registerStockIn: (medicationId: number, entry: StockEntryInput) =>
    apiClient.post<{ medication: Medication }>(`/api/medications/${medicationId}/stock-entries`, entry),

  create: (input: NewMedicationInput) => apiClient.post<{ medication: Medication }>("/api/medications", input),
  update: (id: number, input: UpdateMedicationInput) =>
    apiClient.patch<{ medication: Medication }>(`/api/medications/${id}`, input),
  remove: (id: number) => apiClient.delete<void>(`/api/medications/${id}`),
};
