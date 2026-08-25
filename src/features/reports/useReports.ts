import { useQuery } from "@tanstack/react-query";
import { reportsApi } from "./api";
import type { ReportFilters } from "./types";

export function useRevenueReport(filters: ReportFilters) {
  return useQuery({
    queryKey: ["reports", "revenue", filters],
    queryFn: () => reportsApi.revenue(filters),
  });
}

export function useVisitsReport(filters: ReportFilters, enabled: boolean) {
  return useQuery({
    queryKey: ["reports", "visits", filters],
    queryFn: async () => (await reportsApi.visits(filters)).visits,
    enabled,
  });
}

export function useRevenueByServiceTypeReport(filters: ReportFilters, enabled: boolean) {
  return useQuery({
    queryKey: ["reports", "revenue-by-service", filters],
    queryFn: async () => (await reportsApi.revenueByServiceType(filters)).groups,
    enabled,
  });
}
