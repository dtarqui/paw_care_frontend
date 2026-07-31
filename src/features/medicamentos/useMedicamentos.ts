import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { medicamentosApi } from "./api";
import type { ActualizarMedicamentoInput, NuevoMedicamentoInput } from "./types";

export function useMedicamentos() {
  return useQuery({
    queryKey: ["medicamentos"],
    queryFn: async () => (await medicamentosApi.listar()).medicamentos,
  });
}

export function useMedicamentosBajoStock() {
  return useQuery({
    queryKey: ["medicamentos", "bajo-stock"],
    queryFn: async () => (await medicamentosApi.bajoStock()).medicamentos,
  });
}

export function useRegistrarEntrada() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ medicamentoId, cantidad }: { medicamentoId: number; cantidad: number }) =>
      medicamentosApi.registrarEntrada(medicamentoId, cantidad),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["medicamentos"] });
      toast.success("Entrada registrada correctamente");
    },
    onError: (error: Error) => toast.error(error.message),
  });
}

export function useCrearMedicamento() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: NuevoMedicamentoInput) => medicamentosApi.crear(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["medicamentos"] });
      toast.success("Medicamento creado correctamente");
    },
    onError: (error: Error) => toast.error(error.message),
  });
}

export function useActualizarMedicamento() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: ActualizarMedicamentoInput }) => medicamentosApi.actualizar(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["medicamentos"] });
      toast.success("Medicamento actualizado correctamente");
    },
    onError: (error: Error) => toast.error(error.message),
  });
}

export function useEliminarMedicamento() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => medicamentosApi.eliminar(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["medicamentos"] });
      toast.success("Medicamento eliminado");
    },
    onError: (error: Error) => toast.error(error.message),
  });
}
