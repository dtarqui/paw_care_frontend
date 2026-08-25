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

type TipoReporte = "atenciones" | "ingresos-por-servicio";

function formatearFecha(iso: string) {
  const [fecha] = iso.split("T");
  const [yyyy, mm, dd] = fecha.split("-");
  return `${dd}/${mm}/${yyyy}`;
}

export function ClinicalTab() {
  const [tipo, setTipo] = useState<TipoReporte>("ingresos-por-servicio");
  const [from, setDesde] = useState("");
  const [to, setHasta] = useState("");
  const [descargando, setDescargando] = useState<"excel" | "pdf" | null>(null);

  const filtros = { from: from || undefined, to: to || undefined };
  const reporteAtenciones = useVisitsReport(filtros, tipo === "atenciones");
  const reporteIngresos = useRevenueByServiceTypeReport(filtros, tipo === "ingresos-por-servicio");

  async function descargar(formato: "excel" | "pdf") {
    setDescargando(formato);
    try {
      if (formato === "excel") await reportsApi.downloadExcel(tipo, filtros);
      else await reportsApi.downloadPdf(tipo, filtros);
    } finally {
      setDescargando(null);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardContent className="flex flex-col gap-3 pt-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="flex flex-col gap-1.5">
              <Label>Tipo de reporte</Label>
              <Select value={tipo} onValueChange={(v) => setTipo(v as TipoReporte)}>
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
              <Input id="desdeClinico" type="date" value={from} onChange={(e) => setDesde(e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="hastaClinico">Hasta</Label>
              <Input id="hastaClinico" type="date" value={to} onChange={(e) => setHasta(e.target.value)} />
            </div>
          </div>

          <div className="flex gap-2">
            <Button type="button" variant="outline" size="sm" disabled={!!descargando} onClick={() => descargar("excel")}>
              {descargando === "excel" ? <Loader2 className="size-4 animate-spin" /> : <FileSpreadsheet className="size-4" />}
              Exportar Excel
            </Button>
            <Button type="button" variant="outline" size="sm" disabled={!!descargando} onClick={() => descargar("pdf")}>
              {descargando === "pdf" ? <Loader2 className="size-4 animate-spin" /> : <FileDown className="size-4" />}
              Exportar PDF
            </Button>
          </div>
        </CardContent>
      </Card>

      {tipo === "ingresos-por-servicio" && (
        <Card>
          <CardContent className="pt-6">
            {reporteIngresos.isLoading && <Skeleton className="h-64 w-full" />}
            {reporteIngresos.isError && <ErrorState message="No se pudo cargar el reporte." />}
            {!reporteIngresos.isLoading && reporteIngresos.data?.length === 0 && (
              <EmptyState
                icon={FileSearch}
                title="No hay ingresos que cumplan estos filtros"
                description="Probá ampliando el rango de fechas."
              />
            )}
            {!reporteIngresos.isLoading && reporteIngresos.data && reporteIngresos.data.length > 0 && (
              <ResponsiveContainer width="100%" height={Math.max(220, reporteIngresos.data.length * 48)}>
                <BarChart data={reporteIngresos.data} layout="vertical" margin={{ left: 8, right: 24 }}>
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

            {!reporteIngresos.isLoading && reporteIngresos.data && reporteIngresos.data.length > 0 && (
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
                    {reporteIngresos.data.map((grupo) => (
                      <TableRow key={grupo.serviceType}>
                        <TableCell className="font-medium">{grupo.serviceType}</TableCell>
                        <TableCell className="tabular-nums">{grupo.count}</TableCell>
                        <TableCell className="tabular-nums">{grupo.amount.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {tipo === "atenciones" && (
        <Card>
          <CardContent className="pt-6">
            {reporteAtenciones.isLoading && <TableSkeleton rows={4} />}
            {reporteAtenciones.isError && <ErrorState message="No se pudo cargar el reporte." />}
            {!reporteAtenciones.isLoading && reporteAtenciones.data?.length === 0 && (
              <EmptyState
                icon={FileSearch}
                title="No hay atenciones que cumplan estos filtros"
                description="Probá ampliando el rango de fechas o quitando el filtro de tipo de servicio."
              />
            )}
            {!reporteAtenciones.isLoading && reporteAtenciones.data && reporteAtenciones.data.length > 0 && (
              <>
                <MobileCardList>
                  {reporteAtenciones.data.map((visit) => (
                    <MobileCard
                      key={visit.id}
                      title={visit.pet}
                      subtitle={visit.owner}
                      badge={<StatusBadge status={visit.paymentStatus} />}
                      rows={[
                        { label: "Fecha", value: formatearFecha(visit.date) },
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
                    {reporteAtenciones.data.map((visit) => (
                      <TableRow key={visit.id}>
                        <TableCell>{formatearFecha(visit.date)}</TableCell>
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
