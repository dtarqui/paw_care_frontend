import { apiClient } from "@/lib/api-client";
import type { MedicalVisit, NewVisitInput } from "./types";

export const medicalVisitsApi = {
  petHistory: (petId: number) => apiClient.get<{ visits: MedicalVisit[] }>(`/api/pets/${petId}/visits`),
  create: (input: NewVisitInput) => apiClient.post<{ visit: MedicalVisit }>("/api/visits", input),
};
