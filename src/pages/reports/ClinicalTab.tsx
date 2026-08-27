import { EmptyState, ErrorState } from "@/components/EmptyState";
import { Skeleton } from "@/components/ui/skeleton";
import { DesktopTable, MobileCard, MobileCardList } from "@/components/MobileCard";
import { StatusBadge } from "@/components/StatusBadge";
import { TableSkeleton } from "@/components/TableSkeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { reportsApi } from "@/features/reports/api";
import { useVisitsReport, useRevenueByServiceTypeReport } from "@/features/reports/useReports";
import { FileSearch, FileDown, FileSpreadsheet, Loader2 } from "lucide-react";
import { useFormatters } from "@/lib/useFormatters";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

type ReportType = "visits" | "revenue-by-service";

/** El eje del gráfico necesita un ancho en píxeles, no una clase de Tailwind, así
 * que el corte de pantalla chica se consulta acá en vez de en el CSS. */
function useIsNarrow() {
  const [narrow, setNarrow] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(max-width: 639px)").matches
  );

  useEffect(() => {
    const query = window.matchMedia("(max-width: 639px)");
    const sync = (e: MediaQueryListEvent) => setNarrow(e.matches);
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  return narrow;
}

export function ClinicalTab() {
  const { t } = useTranslation();
  const isNarrow = useIsNarrow();
  const { formatDate } = useFormatters();
  const [type, setType] = useState<ReportType>("revenue-by-service");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [downloading, setDownloading] = useState<"excel" | "pdf" | null>(null);

  const filters = { from: from || undefined, to: to || undefined };
  const visitsReport = useVisitsReport(filters, type === "visits");
  const incomeReport = useRevenueByServiceTypeReport(filters, type === "revenue-by-service");

  /** Recharts pinta lo que hay en el dato: si se le pasa `serviceType` crudo, el eje
   * se queda en español aunque la interfaz esté en inglés. */
  const incomeChartData = (incomeReport.data ?? []).map((group) => ({
    ...group,
    label: t(`enums.serviceType.${group.serviceType}`, { defaultValue: group.serviceType }),
  }));

  async function download(format: "excel" | "pdf") {
    setDownloading(format);
    try {
      if (format === "excel") await reportsApi.downloadExcel(type, filters);
      else await reportsApi.downloadPdf(type, filters);
    } finally {
      setDownloading(null);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardContent className="flex flex-col gap-3 pt-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="flex flex-col gap-1.5">
              <Label>{t("reports.reportType")}</Label>
              <Select value={type} onValueChange={(v) => setType(v as ReportType)}>
                <SelectTrigger className="w-full sm:w-56">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="revenue-by-service">{t("reports.types.revenueByService")}</SelectItem>
                  <SelectItem value="visits">{t("reports.types.visits")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="clinical-from">{t("common.from")}</Label>
              <Input id="clinical-from" type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="clinical-to">{t("common.to")}</Label>
              <Input id="clinical-to" type="date" value={to} onChange={(e) => setTo(e.target.value)} />
            </div>
          </div>

          <div className="flex gap-2">
            <Button type="button" variant="outline" size="sm" disabled={!!downloading} onClick={() => download("excel")}>
              {downloading === "excel" ? <Loader2 className="size-4 animate-spin" /> : <FileSpreadsheet className="size-4" />}
              {t("reports.exportExcel")}
            </Button>
            <Button type="button" variant="outline" size="sm" disabled={!!downloading} onClick={() => download("pdf")}>
              {downloading === "pdf" ? <Loader2 className="size-4 animate-spin" /> : <FileDown className="size-4" />}
              {t("reports.exportPdf")}
            </Button>
          </div>
        </CardContent>
      </Card>

      {type === "revenue-by-service" && (
        <Card>
          <CardContent className="pt-6">
            {incomeReport.isLoading && <Skeleton className="h-64 w-full" />}
            {incomeReport.isError && <ErrorState message={t("reports.loadError")} />}
            {!incomeReport.isLoading && incomeReport.data?.length === 0 && (
              <EmptyState
                icon={FileSearch}
                title={t("reports.noRevenue")}
                description={t("reports.widenRange")}
              />
            )}
            {!incomeReport.isLoading && incomeReport.data && incomeReport.data.length > 0 && (
              <ResponsiveContainer width="100%" height={Math.max(220, incomeReport.data.length * 48)}>
                <BarChart data={incomeChartData} layout="vertical" margin={{ left: 8, right: 24 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--border)" />
                  <XAxis type="number" tickFormatter={(v) => `Bs.${v}`} stroke="var(--muted-foreground)" fontSize={12} />
                  <YAxis
                    type="category"
                    dataKey="label"
                    // En un celular 150px de eje se comen la mitad del ancho útil.
                    width={isNarrow ? 96 : 150}
                    stroke="var(--muted-foreground)"
                    fontSize={12}
                  />
                  <Tooltip
                    formatter={(value) => [`Bs. ${Number(value).toFixed(2)}`, t("common.amount")]}
                    contentStyle={{
                      background: "var(--popover)",
                      border: "1px solid var(--border)",
                      borderRadius: 8,
                      color: "var(--popover-foreground)",
                      fontSize: 13,
                    }}
                  />
                  <Bar dataKey="amount" fill="var(--chart-1)" radius={[0, 4, 4, 0]} barSize={22} />
                </BarChart>
              </ResponsiveContainer>
            )}

            {!incomeReport.isLoading && incomeReport.data && incomeReport.data.length > 0 && (
              <div className="mt-6 min-w-0 overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("visits.serviceType")}</TableHead>
                      <TableHead>{t("common.quantity")}</TableHead>
                      <TableHead>{t("common.amountBs")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {incomeReport.data.map((group) => (
                      <TableRow key={group.serviceType}>
                        <TableCell className="font-medium">
                          {t(`enums.serviceType.${group.serviceType}`, { defaultValue: group.serviceType })}
                        </TableCell>
                        <TableCell className="tabular-nums">{group.count}</TableCell>
                        <TableCell className="tabular-nums">{group.amount.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {type === "visits" && (
        <Card>
          <CardContent className="pt-6">
            {visitsReport.isLoading && <TableSkeleton rows={4} />}
            {visitsReport.isError && <ErrorState message={t("reports.loadError")} />}
            {!visitsReport.isLoading && visitsReport.data?.length === 0 && (
              <EmptyState
                icon={FileSearch}
                title={t("reports.noVisits")}
                description={t("reports.noVisitsHint")}
              />
            )}
            {!visitsReport.isLoading && visitsReport.data && visitsReport.data.length > 0 && (
              <>
                <MobileCardList>
                  {visitsReport.data.map((visit) => (
                    <MobileCard
                      key={visit.id}
                      title={visit.pet}
                      subtitle={visit.owner}
                      badge={<StatusBadge status={visit.paymentStatus} />}
                      rows={[
                        { label: t("common.date"), value: formatDate(visit.date) },
                        {
                          label: t("reports.service"),
                          value: t(`enums.serviceType.${visit.serviceType}`, { defaultValue: visit.serviceType }),
                        },
                        {
                          label: t("common.amount"),
                          value: <span className="font-medium tabular-nums">Bs. {visit.consultationFee.toFixed(2)}</span>,
                        },
                      ]}
                    />
                  ))}
                </MobileCardList>

                <DesktopTable>
                  <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("common.date")}</TableHead>
                      <TableHead>{t("common.pet")}</TableHead>
                      <TableHead>{t("common.owner")}</TableHead>
                      <TableHead>{t("visits.serviceType")}</TableHead>
                      <TableHead className="text-right">{t("common.amount")}</TableHead>
                      <TableHead>{t("common.status")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {visitsReport.data.map((visit) => (
                      <TableRow key={visit.id}>
                        <TableCell>{formatDate(visit.date)}</TableCell>
                        <TableCell>{visit.pet}</TableCell>
                        <TableCell>{visit.owner}</TableCell>
                        <TableCell>{t(`enums.serviceType.${visit.serviceType}`, { defaultValue: visit.serviceType })}</TableCell>
                        <TableCell className="font-medium tabular-nums">Bs. {visit.consultationFee.toFixed(2)}</TableCell>
                        <TableCell>
                          <StatusBadge status={visit.paymentStatus} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                  </Table>
                </DesktopTable>
              </>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
