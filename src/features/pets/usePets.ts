import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { t } from "i18next";
import { toast } from "sonner";
import { petsApi } from "./api";
import type { NewPetInput, UpdatePetInput } from "./types";

export function usePets(page = 1, pageSize = 20, includeInactive = false) {
  return useQuery({
    queryKey: ["pets", "list", page, pageSize, includeInactive],
    queryFn: () => petsApi.list(page, pageSize, includeInactive),
  });
}

export function usePet(id: number) {
  return useQuery({
    queryKey: ["pets", id],
    queryFn: async () => (await petsApi.detail(id)).pet,
  });
}

export function usePetHistory(id: number) {
  return useQuery({
    queryKey: ["pets", id, "history"],
    queryFn: async () => (await petsApi.history(id)).events,
  });
}

export function useUpdatePet(id: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdatePetInput) => petsApi.update(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pets"] });
      queryClient.invalidateQueries({ queryKey: ["pets", id, "history"] });
      toast.success(t("toasts.petUpdated"));
    },
    onError: (error: Error) => toast.error(error.message),
  });
}

export function useChangePetStatus(id: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (status: "ACTIVE" | "INACTIVE") => petsApi.changeStatus(id, status),
    onSuccess: (_data, status) => {
      queryClient.invalidateQueries({ queryKey: ["pets"] });
      toast.success(status === "ACTIVE" ? t("toasts.petReactivated") : t("toasts.petDeleted"));
    },
    onError: (error: Error) => toast.error(error.message),
  });
}

export function useSearchPetsByNationalId(nationalId: string | undefined) {
  return useQuery({
    queryKey: ["pets", "search", nationalId],
    queryFn: async () => (await petsApi.searchByOwnerNationalId(nationalId!)).pets,
    enabled: !!nationalId,
  });
}

export function useCreatePet() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: NewPetInput) => petsApi.create(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pets"] });
      toast.success(t("toasts.petCreated"));
    },
    onError: (error: Error) => toast.error(error.message),
  });
}
