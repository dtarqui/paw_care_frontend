import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ownersApi } from "./api";
import type { UpdateOwnerInput } from "./types";

export function useOwnerByNationalId(nationalId: string | undefined) {
  return useQuery({
    queryKey: ["owners", "search", nationalId],
    queryFn: async () => (await ownersApi.searchByNationalId(nationalId!)).owner,
    enabled: !!nationalId && nationalId.length >= 5,
  });
}

export function useOwners() {
  return useQuery({
    queryKey: ["owners"],
    queryFn: async () => (await ownersApi.list()).owners,
  });
}

export function useUpdateOwner() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: UpdateOwnerInput }) => ownersApi.update(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["owners"] });
      queryClient.invalidateQueries({ queryKey: ["pets"] });
      toast.success("Propietario actualizado correctamente");
    },
    onError: (error: Error) => toast.error(error.message),
  });
}
