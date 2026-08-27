import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { t } from "i18next";
import { toast } from "sonner";
import { remindersApi } from "./api";

export function usePendingReminders() {
  return useQuery({
    queryKey: ["reminders", "pending"],
    queryFn: async () => (await remindersApi.pending()).reminders,
  });
}

export function useReminderHistory(limit = 5) {
  return useQuery({
    queryKey: ["reminders", "history", limit],
    queryFn: async () => (await remindersApi.history(limit)).sent,
  });
}

export function useMarkReminderSent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => remindersApi.markSent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reminders"] });
      toast.success(t("toasts.reminderMarkedSent"));
    },
    onError: (error: Error) => toast.error(error.message),
  });
}
