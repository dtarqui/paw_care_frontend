import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { medicationsApi } from "./api";
import type { NewMedicationInput, UpdateMedicationInput } from "./types";

export function useMedications() {
  return useQuery({
    queryKey: ["medications"],
    queryFn: async () => (await medicationsApi.list()).medications,
  });
}

export function useLowStockMedications() {
  return useQuery({
    queryKey: ["medications", "low-stock"],
    queryFn: async () => (await medicationsApi.lowStock()).medications,
  });
}

export function useRegisterStockIn() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ medicationId, quantity }: { medicationId: number; quantity: number }) =>
      medicationsApi.registerStockIn(medicationId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["medications"] });
      toast.success("Entrada registrada correctamente");
    },
    onError: (error: Error) => toast.error(error.message),
  });
}

export function useCreateMedication() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: NewMedicationInput) => medicationsApi.create(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["medications"] });
      toast.success("Medicamento creado correctamente");
    },
    onError: (error: Error) => toast.error(error.message),
  });
}

export function useUpdateMedication() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: UpdateMedicationInput }) =>
      medicationsApi.update(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["medications"] });
      toast.success("Medicamento actualizado correctamente");
    },
    onError: (error: Error) => toast.error(error.message),
  });
}

export function useDeleteMedication() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => medicationsApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["medications"] });
      toast.success("Medicamento eliminado");
    },
    onError: (error: Error) => toast.error(error.message),
  });
}
