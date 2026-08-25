import { apiClient } from "@/lib/api-client";
import type { PendingReminder, SentReminder } from "./types";

export const remindersApi = {
  pending: () => apiClient.get<{ reminders: PendingReminder[] }>("/api/reminders/pending"),
  history: (limit = 5) => apiClient.get<{ sent: SentReminder[] }>(`/api/reminders/history?limit=${limit}`),
  markSent: (id: string) => apiClient.post<{ ok: boolean }>(`/api/reminders/${encodeURIComponent(id)}/mark-sent`),
};
