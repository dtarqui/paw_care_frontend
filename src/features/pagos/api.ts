import { apiClient } from "@/lib/api-client";
import type { MetodoPago, PagoPendiente } from "./types";

export const pagosApi = {
  listarPendientes: () => apiClient.get<{ pendientes: PagoPendiente[] }>("/api/pagos/pendientes"),

  registrar: (atencionId: number, metodoPago: MetodoPago, monto: number) =>
    apiClient.post("/api/pagos", { atencionId, metodoPago, monto }),
};
