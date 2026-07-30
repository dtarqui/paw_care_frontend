import { useQuery } from "@tanstack/react-query";
import { veterinariosApi } from "./api";

export function useVeterinarios() {
  return useQuery({
    queryKey: ["veterinarios"],
    queryFn: async () => (await veterinariosApi.listar()).veterinarios,
  });
}
