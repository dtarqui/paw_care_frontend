import { apiClient } from "@/lib/api-client";
import type { Medication, NewMedicationInput, UpdateMedicationInput } from "./types";

export const medicationsApi = {
  list: () => apiClient.get<{ medications: Medication[] }>("/api/medications"),
  lowStock: () => apiClient.get<{ medications: Medication[] }>("/api/medications/low-stock"),
  registerStockIn: (medicationId: number, quantity: number) =>
    apiClient.post<{ medication: Medication }>(`/api/medications/${medicationId}/stock-entries`, { quantity }),
  create: (input: NewMedicationInput) => apiClient.post<{ medication: Medication }>("/api/medications", input),
  update: (id: number, input: UpdateMedicationInput) =>
    apiClient.patch<{ medication: Medication }>(`/api/medications/${id}`, input),
  remove: (id: number) => apiClient.delete<void>(`/api/medications/${id}`),
};
