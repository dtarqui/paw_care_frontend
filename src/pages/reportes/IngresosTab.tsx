import { StatusBadge } from "@/components/StatusBadge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useReporteIngresos } from "@/features/reportes/useReportes";
import { TIPOS_SERVICIO } from "@/lib/tipos-servicio";
import { Wallet } from "lucide-react";
import { useState } from "react";

const METODOS = [
  { value: "EFECTIVO", label: "Efectivo" },
  { value: "TARJETA", label: "Tarjeta" },
  { value: "TRANSFERENCIA", label: "Transferencia" },
  { value: "QR", label: "QR" },
] as const;

const TODOS = "__todos__";

function formatearFecha(iso: string) {
  const [fecha] = iso.split("T");
  const [yyyy, mm, dd] = fecha.split("-");
  return `${dd}/${mm}/${yyyy}`;
}

export function IngresosTab() {
  const [desde, setDesde] = useState("");
  const [hasta, setHasta] = useState("");
  const [tipoServicio, setTipoServicio] = useState(TODOS);
  const [metodoPago, setMetodoPago] = useState(TODOS);

  const { data, isLoading, isError } = useReporteIngresos({
    desde: desde || undefined,
    hasta: hasta || undefined,
    tipoServicio: tipoServicio === TODOS ? undefined : tipoServicio,
    metodoPago: metodoPago === TODOS ? undefined : (metodoPago as "EFECTIVO" | "TARJETA" | "TRANSFERENCIA" | "QR"),
  });

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardContent className="grid grid-cols-2 gap-3 pt-6 sm:grid-cols-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="desde">Desde</Label>
            <Input id="desde" type="date" value={desde} onChange={(e) => setDesde(e.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="hasta">Hasta</Label>
            <Input id="hasta" type="date" value={hasta} onChange={(e) => setHasta(e.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Tipo de servicio</Label>
            <Select value={tipoServicio} onValueChange={setTipoServicio}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={TODOS}>Todos</SelectItem>
                {TIPOS_SERVICIO.map((tipo) => (
                  <SelectItem key={tipo} value={tipo}>
                    {tipo}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Método de pago</Label>
            <Select value={metodoPago} onValueChange={setMetodoPago}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={TODOS}>Todos</SelectItem>
                {METODOS.map((m) => (
                  <SelectItem key={m.value} value={m.value}>
                    {m.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Card>
          <CardContent className="flex items-center gap-3 pt-6">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
              <Wallet className="size-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Cantidad de pagos</p>
              <p className="text-2xl font-semibold">{isLoading ? "…" : (data?.totales.cantidad ?? 0)}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 pt-6">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
              <Wallet className="size-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Monto total</p>
              <p className="text-2xl font-semibold">Bs. {(data?.totales.monto ?? 0).toFixed(2)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && (
            <div className="flex flex-col gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          )}
          {isError && <p className="py-8 text-center text-sm text-destructive">No se pudo cargar el reporte.</p>}
          {!isLoading && !isError && data?.pagos.length === 0 && (
            <p className="py-8 text-center text-sm text-muted-foreground">No hay pagos que cumplan estos filtros.</p>
          )}
          {!isLoading && !isError && data && data.pagos.length > 0 && (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Mascota</TableHead>
                    <TableHead>Propietario</TableHead>
                    <TableHead>Tipo de servicio</TableHead>
                    <TableHead>Método</TableHead>
                    <TableHead>Monto</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.pagos.map((pago) => (
                    <TableRow key={pago.id}>
                      <TableCell>{formatearFecha(pago.fecha)}</TableCell>
                      <TableCell>{pago.mascota}</TableCell>
                      <TableCell>{pago.propietario}</TableCell>
                      <TableCell>{pago.tipoServicio}</TableCell>
                      <TableCell>
                        <StatusBadge status={pago.metodoPago} />
                      </TableCell>
                      <TableCell className="font-medium">Bs. {pago.monto.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
