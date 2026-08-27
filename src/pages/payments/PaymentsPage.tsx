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
import { useFormatters } from "@/lib/useFormatters";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { QrChargeDialog } from "./QrChargeDialog";
import { RegisterPaymentDialog } from "./RegisterPaymentDialog";

function formatAmount(amount: number) {
  return `Bs. ${amount.toFixed(2)}`;
}

export function PaymentsPage() {
  const { t } = useTranslation();
  const { formatDate } = useFormatters();
  const { data: pending, isLoading, isError } = usePendingPayments();
  const { data: history, isLoading: loadingHistory } = usePaymentHistory(5);
  const [selected, setSelected] = useState<PendingPayment | null>(null);
  const [selectedQr, setSelectedQr] = useState<PendingPayment | null>(null);

  const pendingTotal = pending?.reduce((sum, p) => sum + p.amount, 0) ?? 0;

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{t("payments.title")}</h1>
        <p className="text-muted-foreground">{t("payments.subtitle")}</p>
      </div>

      {/* La pregunta que trae a alguien a esta pantalla es "cuánto falta cobrar" —
          responderla arriba evita tener que sumar la columna a ojo. */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <StatTile
          label={t("payments.pendingTotal")}
          value={formatAmount(pendingTotal)}
          icon={Wallet}
          isLoading={isLoading}
          tone={pendingTotal > 0 ? "warning" : "default"}
        />
        <StatTile
          label={t("payments.pendingVisits")}
          value={pending?.length ?? 0}
          icon={Receipt}
          isLoading={isLoading}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t("payments.pendingTitle")}</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading && <TableSkeleton rows={3} />}

          {isError && <ErrorState message={t("payments.loadError")} />}

          {!isLoading && !isError && pending?.length === 0 && (
            <EmptyState
              icon={Wallet}
              title={t("payments.emptyPendingTitle")}
              description={t("payments.emptyPendingDescription")}
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
                    rows={[{ label: t("appointments.reason"), value: item.consultationReason }]}
                    actions={
                      <>
                        <Button size="sm" variant="outline" className="flex-1" onClick={() => setSelectedQr(item)}>
                          {t("payments.chargeWithQr")}
                        </Button>
                        <Button size="sm" className="flex-1" onClick={() => setSelected(item)}>
                          {t("payments.registerPayment")}
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
                      <TableHead>{t("common.pet")}</TableHead>
                      <TableHead>{t("common.owner")}</TableHead>
                      <TableHead>{t("appointments.reason")}</TableHead>
                      <TableHead className="text-right">{t("common.amount")}</TableHead>
                      <TableHead className="text-right">{t("common.action")}</TableHead>
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
                              {t("payments.chargeWithQr")}
                            </Button>
                            <Button size="sm" onClick={() => setSelected(item)}>
                              {t("payments.registerPayment")}
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
          <CardTitle className="text-base">{t("payments.latestTitle")}</CardTitle>
        </CardHeader>
        <CardContent>
          {loadingHistory && <TableSkeleton rows={3} />}

          {!loadingHistory && history?.length === 0 && (
            <EmptyState
              icon={History}
              title={t("payments.emptyHistoryTitle")}
              description={t("payments.emptyHistoryDescription")}
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
                      {
                        label: t("common.amount"),
                        value: <span className="tabular-nums">{formatAmount(payment.amount)}</span>,
                      },
                      { label: t("common.date"), value: formatDate(payment.date) },
                    ]}
                  />
                ))}
              </MobileCardList>

              <DesktopTable>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("common.pet")}</TableHead>
                      <TableHead>{t("common.owner")}</TableHead>
                      <TableHead className="text-right">{t("common.amount")}</TableHead>
                      <TableHead>{t("payments.method")}</TableHead>
                      <TableHead>{t("common.date")}</TableHead>
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
