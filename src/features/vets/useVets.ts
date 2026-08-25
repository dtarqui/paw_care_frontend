import { useQuery } from "@tanstack/react-query";
import { vetsApi } from "./api";

export function useVets(activeOnly = false) {
  return useQuery({
    queryKey: ["vets", { activeOnly }],
    queryFn: async () => (await vetsApi.list(activeOnly)).vets,
  });
}
