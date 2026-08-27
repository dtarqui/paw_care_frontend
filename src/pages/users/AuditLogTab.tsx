import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState, ErrorState } from "@/components/EmptyState";
import { DesktopTable, MobileCard, MobileCardList } from "@/components/MobileCard";
import { Pagination } from "@/components/Pagination";
import { TableSkeleton } from "@/components/TableSkeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAuditLogs } from "@/features/audit-logs/useAuditLogs";
import type { AuditAction } from "@/features/audit-logs/types";
import { useFormatters } from "@/lib/useFormatters";
import { History } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const PAGE_SIZE = 20;

const ACTION_STYLE: Record<AuditAction, string> = {
  ACTIVATE_ACCOUNT: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400",
  DEACTIVATE_ACCOUNT: "bg-muted text-muted-foreground",
  RESET_PASSWORD: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400",
  CHANGE_ROLE: "bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-400",
  INVITE_VET: "bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-400",
};

export function AuditLogTab() {
  const { t } = useTranslation();
  const { formatDateTime } = useFormatters();
  const [page, setPage] = useState(1);
  const { data, isLoading, isError } = useAuditLogs(page, PAGE_SIZE);
  const logs = data?.logs;

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-muted-foreground">
        {t("audit.intro")}
      </p>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t("audit.cardTitle")}</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading && <TableSkeleton rows={5} />}

          {isError && <ErrorState message={t("audit.loadError")} />}

          {!isLoading && !isError && logs?.length === 0 && (
            <EmptyState
              icon={History}
              title={t("audit.emptyTitle")}
              description={t("audit.emptyDescription")}
            />
          )}

          {!isLoading && !isError && logs && logs.length > 0 && (
            <>
              <MobileCardList>
                {logs.map((log) => (
                  <MobileCard
                    key={log.id}
                    title={t(`audit.actions.${log.action}`, { defaultValue: log.action })}
                    subtitle={log.actor ? `${log.actor.firstName} ${log.actor.paternalLastName}` : "—"}
                    badge={
                      <span className="whitespace-nowrap text-xs text-muted-foreground">
                        {formatDateTime(log.date)}
                      </span>
                    }
                    rows={log.details ? [{ label: t("audit.detail"), value: log.details }] : undefined}
                  />
                ))}
              </MobileCardList>

              <DesktopTable>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("common.date")}</TableHead>
                      <TableHead>{t("audit.action")}</TableHead>
                      <TableHead>{t("audit.performedBy")}</TableHead>
                      <TableHead>{t("audit.detail")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {logs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell className="whitespace-nowrap text-sm text-muted-foreground">{formatDateTime(log.date)}</TableCell>
                        <TableCell>
                          <Badge className={`border-none font-medium ${ACTION_STYLE[log.action]}`} variant="secondary">
                            {t(`audit.actions.${log.action}`, { defaultValue: log.action })}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {log.actor ? `${log.actor.firstName} ${log.actor.paternalLastName}` : "—"}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">{log.details ?? "—"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </DesktopTable>
              {data && <Pagination page={data.page} pageSize={data.pageSize} total={data.total} onPageChange={setPage} />}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
