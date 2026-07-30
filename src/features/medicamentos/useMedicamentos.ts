import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { medicamentosApi } from "./api";

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
