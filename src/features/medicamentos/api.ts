import { apiClient } from "@/lib/api-client";
import type { Medicamento } from "./types";

export const medicamentosApi = {
  listar: () => apiClient.get<{ medicamentos: Medicamento[] }>("/api/medicamentos"),
  bajoStock: () => apiClient.get<{ medicamentos: Medicamento[] }>("/api/medicamentos/bajo-stock"),
  registrarEntrada: (medicamentoId: number, cantidad: number) =>
    apiClient.post<{ medicamento: Medicamento }>(`/api/medicamentos/${medicamentoId}/entradas`, { cantidad }),
};
