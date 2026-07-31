import { useQuery } from "@tanstack/react-query";
import { veterinariosApi } from "./api";

export function useVeterinarios(soloActivos = false) {
  return useQuery({
    queryKey: ["veterinarios", { soloActivos }],
    queryFn: async () => (await veterinariosApi.listar(soloActivos)).veterinarios,
  });
}
