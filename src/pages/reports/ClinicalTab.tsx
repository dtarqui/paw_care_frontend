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
import { useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

type ReportType = "atenciones" | "ingresos-por-servicio";

function formatDate(iso: string) {
  const [fecha] = iso.split("T");
  const [yyyy, mm, dd] = fecha.split("-");
  return `${dd}/${mm}/${yyyy}`;
}

export function ClinicalTab() {
  const [type, setType] = useState<ReportType>("ingresos-por-servicio");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [downloading, setDownloading] = useState<"excel" | "pdf" | null>(null);

  const filters = { from: from || undefined, to: to || undefined };
  const visitsReport = useVisitsReport(filters, type === "atenciones");
  const incomeReport = useRevenueByServiceTypeReport(filters, type === "ingresos-por-servicio");

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
              <Label>Tipo de reporte</Label>
              <Select value={type} onValueChange={(v) => setType(v as ReportType)}>
                <SelectTrigger className="w-full sm:w-56">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ingresos-por-servicio">Ingresos por tipo de servicio</SelectItem>
                  <SelectItem value="atenciones">Atenciones por período</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="desdeClinico">Desde</Label>
              <Input id="desdeClinico" type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="hastaClinico">Hasta</Label>
              <Input id="hastaClinico" type="date" value={to} onChange={(e) => setTo(e.target.value)} />
            </div>
          </div>

          <div className="flex gap-2">
            <Button type="button" variant="outline" size="sm" disabled={!!downloading} onClick={() => download("excel")}>
              {downloading === "excel" ? <Loader2 className="size-4 animate-spin" /> : <FileSpreadsheet className="size-4" />}
              Exportar Excel
            </Button>
            <Button type="button" variant="outline" size="sm" disabled={!!downloading} onClick={() => download("pdf")}>
              {downloading === "pdf" ? <Loader2 className="size-4 animate-spin" /> : <FileDown className="size-4" />}
              Exportar PDF
            </Button>
          </div>
        </CardContent>
      </Card>

      {type === "ingresos-por-servicio" && (
        <Card>
          <CardContent className="pt-6">
            {incomeReport.isLoading && <Skeleton className="h-64 w-full" />}
            {incomeReport.isError && <ErrorState message="No se pudo cargar el reporte." />}
            {!incomeReport.isLoading && incomeReport.data?.length === 0 && (
              <EmptyState
                icon={FileSearch}
                title="No hay ingresos que cumplan estos filtros"
                description="Probá ampliando el rango de fechas."
              />
            )}
            {!incomeReport.isLoading && incomeReport.data && incomeReport.data.length > 0 && (
              <ResponsiveContainer width="100%" height={Math.max(220, incomeReport.data.length * 48)}>
                <BarChart data={incomeReport.data} layout="vertical" margin={{ left: 8, right: 24 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--border)" />
                  <XAxis type="number" tickFormatter={(v) => `Bs.${v}`} stroke="var(--muted-foreground)" fontSize={12} />
                  <YAxis type="category" dataKey="serviceType" width={150} stroke="var(--muted-foreground)" fontSize={12} />
                  <Tooltip
                    formatter={(value) => [`Bs. ${Number(value).toFixed(2)}`, "Monto"]}
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
              <div className="mt-6 overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tipo de servicio</TableHead>
                      <TableHead>Cantidad</TableHead>
                      <TableHead>Monto (Bs.)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {incomeReport.data.map((group) => (
                      <TableRow key={group.serviceType}>
                        <TableCell className="font-medium">{group.serviceType}</TableCell>
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

      {type === "atenciones" && (
        <Card>
          <CardContent className="pt-6">
            {visitsReport.isLoading && <TableSkeleton rows={4} />}
            {visitsReport.isError && <ErrorState message="No se pudo cargar el reporte." />}
            {!visitsReport.isLoading && visitsReport.data?.length === 0 && (
              <EmptyState
                icon={FileSearch}
                title="No hay atenciones que cumplan estos filtros"
                description="Probá ampliando el rango de fechas o quitando el filtro de tipo de servicio."
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
                        { label: "Fecha", value: formatDate(visit.date) },
                        { label: "Servicio", value: visit.serviceType },
                        {
                          label: "Monto",
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
                      <TableHead>Fecha</TableHead>
                      <TableHead>Mascota</TableHead>
                      <TableHead>Propietario</TableHead>
                      <TableHead>Tipo de servicio</TableHead>
                      <TableHead className="text-right">Monto</TableHead>
                      <TableHead>Estado</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {visitsReport.data.map((visit) => (
                      <TableRow key={visit.id}>
                        <TableCell>{formatDate(visit.date)}</TableCell>
                        <TableCell>{visit.pet}</TableCell>
                        <TableCell>{visit.owner}</TableCell>
                        <TableCell>{visit.serviceType}</TableCell>
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
