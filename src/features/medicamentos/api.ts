import { apiClient } from "@/lib/api-client";
import type { ActualizarMedicamentoInput, Medicamento, NuevoMedicamentoInput } from "./types";

export const medicamentosApi = {
  listar: () => apiClient.get<{ medicamentos: Medicamento[] }>("/api/medicamentos"),
  bajoStock: () => apiClient.get<{ medicamentos: Medicamento[] }>("/api/medicamentos/bajo-stock"),
  registrarEntrada: (medicamentoId: number, cantidad: number) =>
    apiClient.post<{ medicamento: Medicamento }>(`/api/medicamentos/${medicamentoId}/entradas`, { cantidad }),
  crear: (input: NuevoMedicamentoInput) => apiClient.post<{ medicamento: Medicamento }>("/api/medicamentos", input),
  actualizar: (id: number, input: ActualizarMedicamentoInput) =>
    apiClient.patch<{ medicamento: Medicamento }>(`/api/medicamentos/${id}`, input),
  eliminar: (id: number) => apiClient.delete<void>(`/api/medicamentos/${id}`),
};
