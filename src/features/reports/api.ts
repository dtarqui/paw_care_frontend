import { apiClient } from "@/lib/api-client";
import type { ReportFilters, RevenueReport, ServiceTypeGroup, VisitSummary } from "./types";

function query(filters: ReportFilters & { type?: string }): string {
  const params = new URLSearchParams();
  if (filters.from) params.set("from", filters.from);
  if (filters.to) params.set("to", filters.to);
  if (filters.serviceType) params.set("serviceType", filters.serviceType);
  if (filters.paymentMethod) params.set("paymentMethod", filters.paymentMethod);
  if (filters.type) params.set("type", filters.type);
  const text = params.toString();
  return text ? `?${text}` : "";
}

export const reportsApi = {
  revenue: (filters: ReportFilters) => apiClient.get<RevenueReport>(`/api/reports/revenue${query(filters)}`),

  visits: (filters: ReportFilters) =>
    apiClient.get<{ visits: VisitSummary[] }>(`/api/reports${query({ ...filters, type: "visits" })}`),

  revenueByServiceType: (filters: ReportFilters) =>
    apiClient.get<{ groups: ServiceTypeGroup[] }>(
      `/api/reports${query({ ...filters, type: "revenue-by-service" })}`
    ),

  // El nombre del archivo lo pone el backend (ya traducido) en Content-Disposition;
  // lo de acá es solo el respaldo por si ese header no llegara.
  downloadExcel: (type: string, filters: ReportFilters) =>
    apiClient.download(`/api/reports/export/excel${query({ ...filters, type })}`, `pawcare-report-${type}.xlsx`),

  downloadPdf: (type: string, filters: ReportFilters) =>
    apiClient.download(`/api/reports/export/pdf${query({ ...filters, type })}`, `pawcare-report-${type}.pdf`),
};
