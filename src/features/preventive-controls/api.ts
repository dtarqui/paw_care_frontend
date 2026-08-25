import { apiClient } from "@/lib/api-client";
import type { NewPreventiveControlInput, PreventiveControl } from "./types";

export const preventiveControlsApi = {
  petHistory: (petId: number) =>
    apiClient.get<{ controls: PreventiveControl[] }>(`/api/pets/${petId}/preventive-controls`),

  upcoming: (days = 30) =>
    apiClient.get<{ controls: PreventiveControl[] }>(`/api/preventive-controls/upcoming?days=${days}`),

  create: (input: NewPreventiveControlInput) =>
    apiClient.post<{ control: PreventiveControl }>("/api/preventive-controls", input),
};
