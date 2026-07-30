import { useQuery } from "@tanstack/react-query";
import { propietariosApi } from "./api";

export function usePropietarioPorCi(ci: string | undefined) {
  return useQuery({
    queryKey: ["propietarios", "buscar", ci],
    queryFn: async () => (await propietariosApi.buscarPorCi(ci!)).propietario,
    enabled: !!ci && ci.length >= 5,
  });
}
