import { useQuery } from "@tanstack/react-query";
import { loginEventsApi } from "./api";
import type { LoginEventFilter } from "./types";

export function useLoginEvents(page = 1, pageSize = 20, outcome: LoginEventFilter = "all", username = "") {
  return useQuery({
    queryKey: ["login-events", "list", page, pageSize, outcome, username],
    queryFn: () => loginEventsApi.list(page, pageSize, outcome, username),
    // La lista crece sola mientras la pantalla está abierta; mantenerla fresca es
    // parte de lo que se viene a mirar acá.
    refetchInterval: 60_000,
  });
}
