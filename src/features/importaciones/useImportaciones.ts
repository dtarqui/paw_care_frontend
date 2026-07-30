import { useMutation, useQueryClient } from "@tanstack/react-query";
import { importacionesApi } from "./api";

export function useImportarClientes() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (archivo: File) => importacionesApi.clientes(archivo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mascotas"] });
    },
  });
}
