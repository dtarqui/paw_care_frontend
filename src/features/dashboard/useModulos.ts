import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "./api";

export function useModulos() {
  return useQuery({
    queryKey: ["dashboard", "modulos"],
    queryFn: async () => (await dashboardApi.modulos()).modulos,
  });
}
