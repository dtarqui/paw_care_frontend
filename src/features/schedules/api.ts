import { apiClient } from "@/lib/api-client";
import type { Schedule, ScheduleBlockInput } from "./types";

export const schedulesApi = {
  list: (vetId: number) => apiClient.get<{ schedules: Schedule[] }>(`/api/vets/${vetId}/schedules`),
  update: (vetId: number, schedules: ScheduleBlockInput[]) =>
    apiClient.put<{ schedules: Schedule[] }>(`/api/vets/${vetId}/schedules`, { schedules }),
};
