import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { usePaymentHistory, usePendingPayments } from "@/features/payments/usePayments";
import type { PendingPayment } from "@/features/payments/types";
import { History, Wallet } from "lucide-react";
import { useState } from "react";
import { QrChargeDialog } from "./QrChargeDialog";
import { RegisterPaymentDialog } from "./RegisterPaymentDialog";

function formatearFecha(iso: string) {
  const [fecha] = iso.split("T");
  const [yyyy, mm, dd] = fecha.split("-");
  return `${dd}/${mm}/${yyyy}`;
}

const METODO_LABEL: Record<string, string> = {
  EFECTIVO: "Efectivo",
  TARJETA: "Tarjeta",
  TRANSFERENCIA: "Transferencia",
  QR: "QR",
};

export function PaymentsPage() {
  const { data: pending, isLoading, isError } = usePendingPayments();
  const { data: historial, isLoading: cargandoHistorial } = usePaymentHistory(5);
  const [seleccionado, setSeleccionado] = useState<PendingPayment | null>(null);
  const [seleccionadoQr, setSeleccionadoQr] = useState<PendingPayment | null>(null);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Pagos</h1>
        <p className="text-muted-foreground">Atenciones pending de cobro</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Pendientes de pago</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading && (
            <div className="flex flex-col gap-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          )}

          {isError && (
            <p className="py-8 text-center text-sm text-destructive">No se pudo cargar la lista de pagos.</p>
          )}

          {!isLoading && !isError && pending?.length === 0 && (
            <div className="flex flex-col items-center gap-2 py-12 text-center text-muted-foreground">
              <Wallet className="size-8" />
              <p>No hay pagos pending. Todo al día.</p>
            </div>
          )}

          {!isLoading && !isError && pending && pending.length > 0 && (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Pet</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead>Motivo</TableHead>
                    <TableHead>Monto</TableHead>
                    <TableHead className="text-right">Acción</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pending.map((pendiente) => (
                    <TableRow key={pendiente.visitId}>
                      <TableCell className="font-medium">{pendiente.pet.name}</TableCell>
                      <TableCell>
                        {pendiente.owner.firstName} {pendiente.owner.paternalLastName}
                      </TableCell>
                      <TableCell>{pendiente.consultationReason}</TableCell>
                      <TableCell>Bs. {pendiente.amount.toFixed(2)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button size="sm" variant="outline" onClick={() => setSeleccionadoQr(pendiente)}>
                            Cobrar con QR
                          </Button>
                          <Button size="sm" onClick={() => setSeleccionado(pendiente)}>
                            Registrar payment
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Últimos payments</CardTitle>
        </CardHeader>
        <CardContent>
          {cargandoHistorial && (
            <div className="flex flex-col gap-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          )}

          {!cargandoHistorial && historial?.length === 0 && (
            <div className="flex flex-col items-center gap-2 py-8 text-center text-muted-foreground">
              <History className="size-7" />
              <p>Todavía no hay pagos registrados.</p>
            </div>
          )}

          {!cargandoHistorial && historial && historial.length > 0 && (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Pet</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead>Monto</TableHead>
                    <TableHead>Método</TableHead>
                    <TableHead>Fecha</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {historial.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell className="font-medium">{payment.pet.name}</TableCell>
                      <TableCell>
                        {payment.owner.firstName} {payment.owner.paternalLastName}
                      </TableCell>
                      <TableCell>Bs. {payment.amount.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="border-none font-normal">
                          {METODO_LABEL[payment.method] ?? payment.method}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatearFecha(payment.date)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <RegisterPaymentDialog pendiente={seleccionado} onClose={() => setSeleccionado(null)} />
      <QrChargeDialog pendiente={seleccionadoQr} onClose={() => setSeleccionadoQr(null)} />
    </div>
  );
}
