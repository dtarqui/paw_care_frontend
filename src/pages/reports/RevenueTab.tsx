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
import { useFormatters } from "@/lib/useFormatters";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const PAYMENT_METHODS = ["CASH", "CARD", "TRANSFER", "QR"] as const;

const ALL = "__all__";

export function RevenueTab() {
  const { t } = useTranslation();
  const { formatDate } = useFormatters();
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [serviceType, setServiceType] = useState(ALL);
  const [paymentMethod, setPaymentMethod] = useState(ALL);

  const { data, isLoading, isError } = useRevenueReport({
    from: from || undefined,
    to: to || undefined,
    serviceType: serviceType === ALL ? undefined : serviceType,
    paymentMethod: paymentMethod === ALL ? undefined : (paymentMethod as "CASH" | "CARD" | "TRANSFER" | "QR"),
  });

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardContent className="grid grid-cols-2 gap-3 pt-6 sm:grid-cols-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="from">{t("common.from")}</Label>
            <Input id="from" type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="to">{t("common.to")}</Label>
            <Input id="to" type="date" value={to} onChange={(e) => setTo(e.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>{t("visits.serviceType")}</Label>
            <Select value={serviceType} onValueChange={setServiceType}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>{t("common.all")}</SelectItem>
                {SERVICE_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {t(`enums.serviceType.${type}`, { defaultValue: type })}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>{t("payments.method")}</Label>
            <Select value={paymentMethod} onValueChange={setPaymentMethod}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>{t("common.all")}</SelectItem>
                {PAYMENT_METHODS.map((value) => (
                  <SelectItem key={value} value={value}>
                    {t(`enums.status.${value}`)}
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
              <p className="text-sm text-muted-foreground">{t("reports.paymentCount")}</p>
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
              <p className="text-sm text-muted-foreground">{t("reports.totalAmount")}</p>
              <p className="text-2xl font-semibold">Bs. {(data?.totals.amount ?? 0).toFixed(2)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading && <TableSkeleton rows={4} />}
          {isError && <ErrorState message={t("reports.loadError")} />}
          {!isLoading && !isError && data?.payments.length === 0 && (
            <EmptyState
              icon={FileSearch}
              title={t("reports.noPayments")}
              description={t("reports.noPaymentsHint")}
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
                      { label: t("common.date"), value: formatDate(payment.date) },
                      {
                        label: t("reports.service"),
                        value: t(`enums.serviceType.${payment.serviceType}`, { defaultValue: payment.serviceType }),
                      },
                      {
                        label: t("common.amount"),
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
                    <TableHead>{t("common.date")}</TableHead>
                    <TableHead>{t("common.pet")}</TableHead>
                    <TableHead>{t("common.owner")}</TableHead>
                    <TableHead>{t("visits.serviceType")}</TableHead>
                    <TableHead>{t("payments.method")}</TableHead>
                    <TableHead>{t("common.amount")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.payments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>{formatDate(payment.date)}</TableCell>
                      <TableCell>{payment.pet}</TableCell>
                      <TableCell>{payment.owner}</TableCell>
                      <TableCell>{t(`enums.serviceType.${payment.serviceType}`, { defaultValue: payment.serviceType })}</TableCell>
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
