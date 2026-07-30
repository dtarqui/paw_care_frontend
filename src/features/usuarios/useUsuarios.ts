import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { usuariosApi } from "./api";
import type { NuevoUsuarioInput } from "./types";

export function useUsuarios() {
  return useQuery({
    queryKey: ["usuarios"],
    queryFn: async () => (await usuariosApi.listar()).usuarios,
  });
}

export function useCrearUsuario() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: NuevoUsuarioInput) => usuariosApi.crear(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["usuarios"] });
      queryClient.invalidateQueries({ queryKey: ["veterinarios"] });
      toast.success("Usuario registrado correctamente");
    },
    onError: (error: Error) => toast.error(error.message),
  });
}
