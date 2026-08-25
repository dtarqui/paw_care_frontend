import { apiClient } from "@/lib/api-client";
import type { Owner } from "@/features/pets/types";
import type { OwnerWithPets, UpdateOwnerInput } from "./types";

export const ownersApi = {
  searchByNationalId: (nationalId: string) =>
    apiClient.get<{ owner: Owner | null }>(`/api/owners/search?nationalId=${encodeURIComponent(nationalId)}`),
  list: () => apiClient.get<{ owners: OwnerWithPets[] }>("/api/owners"),
  update: (id: number, input: UpdateOwnerInput) =>
    apiClient.patch<{ owner: Owner }>(`/api/owners/${id}`, input),
};
