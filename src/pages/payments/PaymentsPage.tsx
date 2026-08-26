import { EmptyState, ErrorState } from "@/components/EmptyState";
import { DesktopTable, MobileCard, MobileCardList } from "@/components/MobileCard";
import { StatTile } from "@/components/StatTile";
import { StatusBadge } from "@/components/StatusBadge";
import { TableSkeleton } from "@/components/TableSkeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { usePaymentHistory, usePendingPayments } from "@/features/payments/usePayments";
import type { PendingPayment } from "@/features/payments/types";
import { History, Receipt, Wallet } from "lucide-react";
import { useState } from "react";
import { QrChargeDialog } from "./QrChargeDialog";
import { RegisterPaymentDialog } from "./RegisterPaymentDialog";

function formatDate(iso: string) {
  const [date] = iso.split("T");
  const [yyyy, mm, dd] = date.split("-");
  return `${dd}/${mm}/${yyyy}`;
}

function formatAmount(amount: number) {
  return `Bs. ${amount.toFixed(2)}`;
}

export function PaymentsPage() {
  const { data: pending, isLoading, isError } = usePendingPayments();
  const { data: history, isLoading: loadingHistory } = usePaymentHistory(5);
  const [selected, setSelected] = useState<PendingPayment | null>(null);
  const [selectedQr, setSelectedQr] = useState<PendingPayment | null>(null);

  const pendingTotal = pending?.reduce((sum, p) => sum + p.amount, 0) ?? 0;

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Pagos</h1>
        <p className="text-muted-foreground">Atenciones pendientes de cobro</p>
      </div>

      {/* La pregunta que trae a alguien a esta pantalla es "cuánto falta cobrar" —
          responderla arriba evita tener que sumar la columna a ojo. */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <StatTile
          label="Pendiente de cobro"
          value={formatAmount(pendingTotal)}
          icon={Wallet}
          isLoading={isLoading}
          tone={pendingTotal > 0 ? "warning" : "default"}
        />
        <StatTile
          label="Atenciones por cobrar"
          value={pending?.length ?? 0}
          icon={Receipt}
          isLoading={isLoading}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Pendientes de pago</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading && <TableSkeleton rows={3} />}

          {isError && <ErrorState message="No se pudo cargar la lista de pagos." />}

          {!isLoading && !isError && pending?.length === 0 && (
            <EmptyState
              icon={Wallet}
              title="No hay pagos pendientes"
              description="Todas las atenciones registradas ya fueron cobradas."
            />
          )}

          {!isLoading && !isError && pending && pending.length > 0 && (
            <>
              <MobileCardList>
                {pending.map((item) => (
                  <MobileCard
                    key={item.visitId}
                    title={item.pet.name}
                    subtitle={`${item.owner.firstName} ${item.owner.paternalLastName}`}
                    badge={<span className="font-medium tabular-nums">{formatAmount(item.amount)}</span>}
                    rows={[{ label: "Motivo", value: item.consultationReason }]}
                    actions={
                      <>
                        <Button size="sm" variant="outline" className="flex-1" onClick={() => setSelectedQr(item)}>
                          Cobrar con QR
                        </Button>
                        <Button size="sm" className="flex-1" onClick={() => setSelected(item)}>
                          Registrar pago
                        </Button>
                      </>
                    }
                  />
                ))}
              </MobileCardList>

              <DesktopTable>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Mascota</TableHead>
                      <TableHead>Propietario</TableHead>
                      <TableHead>Motivo</TableHead>
                      <TableHead className="text-right">Monto</TableHead>
                      <TableHead className="text-right">Acción</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pending.map((item) => (
                      <TableRow key={item.visitId}>
                        <TableCell className="font-medium">{item.pet.name}</TableCell>
                        <TableCell>
                          {item.owner.firstName} {item.owner.paternalLastName}
                        </TableCell>
                        <TableCell>{item.consultationReason}</TableCell>
                        <TableCell className="text-right tabular-nums">{formatAmount(item.amount)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button size="sm" variant="outline" onClick={() => setSelectedQr(item)}>
                              Cobrar con QR
                            </Button>
                            <Button size="sm" onClick={() => setSelected(item)}>
                              Registrar pago
                            </Button>
                          </div>
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

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Últimos pagos</CardTitle>
        </CardHeader>
        <CardContent>
          {loadingHistory && <TableSkeleton rows={3} />}

          {!loadingHistory && history?.length === 0 && (
            <EmptyState
              icon={History}
              title="Todavía no hay pagos registrados"
              description="Los cobros que registres van a aparecer acá."
            />
          )}

          {!loadingHistory && history && history.length > 0 && (
            <>
              <MobileCardList>
                {history.map((payment) => (
                  <MobileCard
                    key={payment.id}
                    title={payment.pet.name}
                    subtitle={`${payment.owner.firstName} ${payment.owner.paternalLastName}`}
                    badge={<StatusBadge status={payment.method} />}
                    rows={[
                      { label: "Monto", value: <span className="tabular-nums">{formatAmount(payment.amount)}</span> },
                      { label: "Fecha", value: formatDate(payment.date) },
                    ]}
                  />
                ))}
              </MobileCardList>

              <DesktopTable>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Mascota</TableHead>
                      <TableHead>Propietario</TableHead>
                      <TableHead className="text-right">Monto</TableHead>
                      <TableHead>Método</TableHead>
                      <TableHead>Fecha</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {history.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell className="font-medium">{payment.pet.name}</TableCell>
                        <TableCell>
                          {payment.owner.firstName} {payment.owner.paternalLastName}
                        </TableCell>
                        <TableCell className="text-right tabular-nums">{formatAmount(payment.amount)}</TableCell>
                        <TableCell>
                          <StatusBadge status={payment.method} />
                        </TableCell>
                        <TableCell>{formatDate(payment.date)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </DesktopTable>
            </>
          )}
        </CardContent>
      </Card>

      <RegisterPaymentDialog pendingPayment={selected} onClose={() => setSelected(null)} />
      <QrChargeDialog pendingPayment={selectedQr} onClose={() => setSelectedQr(null)} />
    </div>
  );
}
