import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { reportesApi } from "@/features/reportes/api";
import { useReporteAtenciones, useReporteIngresosPorServicio } from "@/features/reportes/useReportes";
import { FileDown, FileSpreadsheet, Loader2 } from "lucide-react";
import { useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

type TipoReporte = "atenciones" | "ingresos-por-servicio";

function formatearFecha(iso: string) {
  const [fecha] = iso.split("T");
  const [yyyy, mm, dd] = fecha.split("-");
  return `${dd}/${mm}/${yyyy}`;
}

export function ClinicosTab() {
  const [tipo, setTipo] = useState<TipoReporte>("ingresos-por-servicio");
  const [desde, setDesde] = useState("");
  const [hasta, setHasta] = useState("");
  const [descargando, setDescargando] = useState<"excel" | "pdf" | null>(null);

  const filtros = { desde: desde || undefined, hasta: hasta || undefined };
  const reporteAtenciones = useReporteAtenciones(filtros, tipo === "atenciones");
  const reporteIngresos = useReporteIngresosPorServicio(filtros, tipo === "ingresos-por-servicio");

  async function descargar(formato: "excel" | "pdf") {
    setDescargando(formato);
    try {
      if (formato === "excel") await reportesApi.descargarExcel(tipo, filtros);
      else await reportesApi.descargarPdf(tipo, filtros);
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
              <Input id="desdeClinico" type="date" value={desde} onChange={(e) => setDesde(e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="hastaClinico">Hasta</Label>
              <Input id="hastaClinico" type="date" value={hasta} onChange={(e) => setHasta(e.target.value)} />
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
            {reporteIngresos.isError && <p className="py-8 text-center text-sm text-destructive">No se pudo cargar el reporte.</p>}
            {!reporteIngresos.isLoading && reporteIngresos.data?.length === 0 && (
              <p className="py-8 text-center text-sm text-muted-foreground">No hay ingresos que cumplan estos filtros.</p>
            )}
            {!reporteIngresos.isLoading && reporteIngresos.data && reporteIngresos.data.length > 0 && (
              <ResponsiveContainer width="100%" height={Math.max(220, reporteIngresos.data.length * 48)}>
                <BarChart data={reporteIngresos.data} layout="vertical" margin={{ left: 8, right: 24 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--border)" />
                  <XAxis type="number" tickFormatter={(v) => `Bs.${v}`} stroke="var(--muted-foreground)" fontSize={12} />
                  <YAxis type="category" dataKey="tipoServicio" width={150} stroke="var(--muted-foreground)" fontSize={12} />
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
                  <Bar dataKey="monto" fill="var(--primary)" radius={[0, 4, 4, 0]} barSize={22} />
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
                      <TableRow key={grupo.tipoServicio}>
                        <TableCell className="font-medium">{grupo.tipoServicio}</TableCell>
                        <TableCell>{grupo.cantidad}</TableCell>
                        <TableCell>{grupo.monto.toFixed(2)}</TableCell>
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
            {reporteAtenciones.isLoading && (
              <div className="flex flex-col gap-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </div>
            )}
            {reporteAtenciones.isError && <p className="py-8 text-center text-sm text-destructive">No se pudo cargar el reporte.</p>}
            {!reporteAtenciones.isLoading && reporteAtenciones.data?.length === 0 && (
              <p className="py-8 text-center text-sm text-muted-foreground">No hay atenciones que cumplan estos filtros.</p>
            )}
            {!reporteAtenciones.isLoading && reporteAtenciones.data && reporteAtenciones.data.length > 0 && (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Mascota</TableHead>
                      <TableHead>Propietario</TableHead>
                      <TableHead>Tipo de servicio</TableHead>
                      <TableHead>Monto</TableHead>
                      <TableHead>Estado</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reporteAtenciones.data.map((atencion) => (
                      <TableRow key={atencion.id}>
                        <TableCell>{formatearFecha(atencion.fecha)}</TableCell>
                        <TableCell>{atencion.mascota}</TableCell>
                        <TableCell>{atencion.propietario}</TableCell>
                        <TableCell>{atencion.tipoServicio}</TableCell>
                        <TableCell className="font-medium">Bs. {atencion.montoConsulta.toFixed(2)}</TableCell>
                        <TableCell>
                          <StatusBadge status={atencion.estadoPago} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
