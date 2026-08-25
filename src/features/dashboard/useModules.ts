import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "./api";

export function useModules() {
  return useQuery({
    queryKey: ["dashboard", "modules"],
    queryFn: async () => (await dashboardApi.modules()).modules,
  });
}
