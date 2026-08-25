import { useMutation, useQueryClient } from "@tanstack/react-query";
import { importsApi } from "./api";

export function useImportClients() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => importsApi.clients(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pets"] });
    },
  });
}
