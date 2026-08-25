import { apiClient } from "@/lib/api-client";
import type { NewPetInput, Pet, PetHistoryEvent, UpdatePetInput } from "./types";

export interface PetListResponse {
  pets: Pet[];
  total: number;
  page: number;
  pageSize: number;
}

export const petsApi = {
  list: (page = 1, pageSize = 20, includeInactive = false) =>
    apiClient.get<PetListResponse>(
      `/api/pets?page=${page}&pageSize=${pageSize}${includeInactive ? "&active=false" : ""}`
    ),
  searchByOwnerNationalId: (nationalId: string) =>
    apiClient.get<{ pets: Pet[] }>(`/api/pets/search?nationalId=${encodeURIComponent(nationalId)}`),
  create: (input: NewPetInput) => apiClient.post<{ pet: Pet }>("/api/pets", input),
  detail: (id: number) => apiClient.get<{ pet: Pet }>(`/api/pets/${id}`),
  update: (id: number, input: UpdatePetInput) => apiClient.patch<{ pet: Pet }>(`/api/pets/${id}`, input),
  history: (id: number) => apiClient.get<{ events: PetHistoryEvent[] }>(`/api/pets/${id}/history`),
  changeStatus: (id: number, status: "ACTIVE" | "INACTIVE") =>
    apiClient.patch<{ pet: Pet }>(`/api/pets/${id}/status`, { status }),
};
