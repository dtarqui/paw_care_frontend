import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { schedulesApi } from "./api";
import type { ScheduleBlockInput } from "./types";

export function useSchedules(vetId: number | undefined) {
  return useQuery({
    queryKey: ["schedules", vetId],
    queryFn: async () => (await schedulesApi.list(vetId!)).schedules,
    enabled: !!vetId,
  });
}

export function useUpdateSchedules(vetId: number | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (schedules: ScheduleBlockInput[]) => schedulesApi.update(vetId!, schedules),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedules", vetId] });
      queryClient.invalidateQueries({ queryKey: ["appointments", "availability"] });
      toast.success("Horario actualizado correctamente");
    },
    onError: (error: Error) => toast.error(error.message),
  });
}
