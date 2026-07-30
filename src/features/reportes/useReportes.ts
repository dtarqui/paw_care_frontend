import { useQuery } from "@tanstack/react-query";
import { reportesApi } from "./api";
import type { FiltrosReporte } from "./types";

export function useReporteIngresos(filtros: FiltrosReporte) {
  return useQuery({
    queryKey: ["reportes", "ingresos", filtros],
    queryFn: () => reportesApi.ingresos(filtros),
  });
}

export function useReporteAtenciones(filtros: FiltrosReporte, habilitado: boolean) {
  return useQuery({
    queryKey: ["reportes", "atenciones", filtros],
    queryFn: async () => (await reportesApi.atenciones(filtros)).atenciones,
    enabled: habilitado,
  });
}

export function useReporteIngresosPorServicio(filtros: FiltrosReporte, habilitado: boolean) {
  return useQuery({
    queryKey: ["reportes", "ingresos-por-servicio", filtros],
    queryFn: async () => (await reportesApi.ingresosPorServicio(filtros)).grupos,
    enabled: habilitado,
  });
}
