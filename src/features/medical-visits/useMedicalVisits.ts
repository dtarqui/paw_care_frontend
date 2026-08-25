import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { medicalVisitsApi } from "./api";
import type { NewVisitInput } from "./types";

export function useVisitHistory(petId: number | undefined) {
  return useQuery({
    queryKey: ["medical-visits", "history", petId],
    queryFn: async () => (await medicalVisitsApi.petHistory(petId!)).visits,
    enabled: !!petId,
  });
}

export function useCreateVisit() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: NewVisitInput) => medicalVisitsApi.create(input),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["medical-visits", "history", variables.petId] });
      queryClient.invalidateQueries({ queryKey: ["payments", "pending"] });
      // También afecta la ficha de mascota (peso actual + línea de tiempo unificada).
      queryClient.invalidateQueries({ queryKey: ["pets"] });
      toast.success("Atención registrada. Queda disponible para cobro en Pagos.");
    },
    onError: (error: Error) => toast.error(error.message),
  });
}
