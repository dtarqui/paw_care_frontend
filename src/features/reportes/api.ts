import { apiClient } from "@/lib/api-client";
import type { AtencionResumen, FiltrosReporte, GrupoPorServicio, ReporteIngresos } from "./types";

function query(filtros: FiltrosReporte & { tipo?: string }): string {
  const params = new URLSearchParams();
  if (filtros.desde) params.set("desde", filtros.desde);
  if (filtros.hasta) params.set("hasta", filtros.hasta);
  if (filtros.tipoServicio) params.set("tipoServicio", filtros.tipoServicio);
  if (filtros.metodoPago) params.set("metodoPago", filtros.metodoPago);
  if (filtros.tipo) params.set("tipo", filtros.tipo);
  const texto = params.toString();
  return texto ? `?${texto}` : "";
}

export const reportesApi = {
  ingresos: (filtros: FiltrosReporte) => apiClient.get<ReporteIngresos>(`/api/reportes/ingresos${query(filtros)}`),

  atenciones: (filtros: FiltrosReporte) =>
    apiClient.get<{ atenciones: AtencionResumen[] }>(`/api/reportes${query({ ...filtros, tipo: "atenciones" })}`),

  ingresosPorServicio: (filtros: FiltrosReporte) =>
    apiClient.get<{ grupos: GrupoPorServicio[] }>(`/api/reportes${query({ ...filtros, tipo: "ingresos-por-servicio" })}`),

  descargarExcel: (tipo: string, filtros: FiltrosReporte) =>
    apiClient.download(`/api/reportes/export/excel${query({ ...filtros, tipo })}`, `reporte-${tipo}.xlsx`),

  descargarPdf: (tipo: string, filtros: FiltrosReporte) =>
    apiClient.download(`/api/reportes/export/pdf${query({ ...filtros, tipo })}`, `reporte-${tipo}.pdf`),
};
