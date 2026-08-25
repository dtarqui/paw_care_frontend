import { EmptyState, ErrorState } from "@/components/EmptyState";
import { DesktopTable, MobileCard, MobileCardList } from "@/components/MobileCard";
import { StatusBadge } from "@/components/StatusBadge";
import { TableSkeleton } from "@/components/TableSkeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useRevenueReport } from "@/features/reports/useReports";
import { SERVICE_TYPES } from "@/lib/service-types";
import { FileSearch, Wallet } from "lucide-react";
import { useState } from "react";

const METODOS = [
  { value: "CASH", label: "Efectivo" },
  { value: "CARD", label: "Tarjeta" },
  { value: "TRANSFER", label: "Transferencia" },
  { value: "QR", label: "QR" },
] as const;

const TODOS = "__todos__";

function formatearFecha(iso: string) {
  const [fecha] = iso.split("T");
  const [yyyy, mm, dd] = fecha.split("-");
  return `${dd}/${mm}/${yyyy}`;
}

export function RevenueTab() {
  const [from, setDesde] = useState("");
  const [to, setHasta] = useState("");
  const [tipoServicio, setTipoServicio] = useState(TODOS);
  const [metodoPago, setMetodoPago] = useState(TODOS);

  const { data, isLoading, isError } = useRevenueReport({
    from: from || undefined,
    to: to || undefined,
    serviceType: tipoServicio === TODOS ? undefined : tipoServicio,
    paymentMethod: metodoPago === TODOS ? undefined : (metodoPago as "CASH" | "CARD" | "TRANSFER" | "QR"),
  });

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardContent className="grid grid-cols-2 gap-3 pt-6 sm:grid-cols-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="from">Desde</Label>
            <Input id="from" type="date" value={from} onChange={(e) => setDesde(e.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="to">Hasta</Label>
            <Input id="to" type="date" value={to} onChange={(e) => setHasta(e.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Tipo de servicio</Label>
            <Select value={tipoServicio} onValueChange={setTipoServicio}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={TODOS}>Todos</SelectItem>
                {SERVICE_TYPES.map((tipo) => (
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
              <p className="text-2xl font-semibold">{isLoading ? "…" : (data?.totals.count ?? 0)}</p>
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
              <p className="text-2xl font-semibold">Bs. {(data?.totals.amount ?? 0).toFixed(2)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <TableSkeleton rows={4} />}
          {isError && <ErrorState message="No se pudo cargar el reporte." />}
          {!isLoading && !isError && data?.payments.length === 0 && (
            <EmptyState
              icon={FileSearch}
              title="No hay pagos que cumplan estos filtros"
              description="Probá ampliando el rango de fechas, o quitando el filtro de método de pago."
            />
          )}
          {!isLoading && !isError && data && data.payments.length > 0 && (
            <>
              <MobileCardList>
                {data.payments.map((payment) => (
                  <MobileCard
                    key={payment.id}
                    title={payment.pet}
                    subtitle={payment.owner}
                    badge={<StatusBadge status={payment.method} />}
                    rows={[
                      { label: "Fecha", value: formatearFecha(payment.date) },
                      { label: "Servicio", value: payment.serviceType },
                      {
                        label: "Monto",
                        value: <span className="font-medium tabular-nums">Bs. {payment.amount.toFixed(2)}</span>,
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
                    <TableHead>Método</TableHead>
                    <TableHead>Monto</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.payments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>{formatearFecha(payment.date)}</TableCell>
                      <TableCell>{payment.pet}</TableCell>
                      <TableCell>{payment.owner}</TableCell>
                      <TableCell>{payment.serviceType}</TableCell>
                      <TableCell>
                        <StatusBadge status={payment.method} />
                      </TableCell>
                      <TableCell className="font-medium tabular-nums">Bs. {payment.amount.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                </Table>
              </DesktopTable>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
