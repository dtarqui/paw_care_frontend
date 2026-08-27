import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { t } from "i18next";
import { toast } from "sonner";
import { preventiveControlsApi } from "./api";
import type { NewPreventiveControlInput } from "./types";

export function usePreventiveHistory(petId: number | undefined) {
  return useQuery({
    queryKey: ["preventive-controls", "history", petId],
    queryFn: async () => (await preventiveControlsApi.petHistory(petId!)).controls,
    enabled: !!petId,
  });
}

export function useUpcomingControls(days = 30) {
  return useQuery({
    queryKey: ["preventive-controls", "upcoming", days],
    queryFn: async () => (await preventiveControlsApi.upcoming(days)).controls,
  });
}

export function useCreatePreventiveControl() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: NewPreventiveControlInput) => preventiveControlsApi.create(input),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["preventive-controls", "history", variables.petId] });
      queryClient.invalidateQueries({ queryKey: ["preventive-controls", "upcoming"] });
      queryClient.invalidateQueries({ queryKey: ["pets"] });
      toast.success(t("toasts.preventiveControlRecorded"));
    },
    onError: (error: Error) => toast.error(error.message),
  });
}
