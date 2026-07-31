import { apiClient } from "@/lib/api-client";
import type { MetodoPago, PagoHistorial, PagoPendiente } from "./types";

export const pagosApi = {
  listarPendientes: () => apiClient.get<{ pendientes: PagoPendiente[] }>("/api/pagos/pendientes"),

  historial: (limit = 5) => apiClient.get<{ pagos: PagoHistorial[] }>(`/api/pagos/historial?limit=${limit}`),

  registrar: (atencionId: number, metodoPago: MetodoPago, monto: number) =>
    apiClient.post("/api/pagos", { atencionId, metodoPago, monto }),
};
