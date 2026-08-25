import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState, ErrorState } from "@/components/EmptyState";
import { DesktopTable, MobileCard, MobileCardList } from "@/components/MobileCard";
import { Pagination } from "@/components/Pagination";
import { TableSkeleton } from "@/components/TableSkeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAuditLogs } from "@/features/audit-logs/useAuditLogs";
import type { AuditAction } from "@/features/audit-logs/types";
import { History } from "lucide-react";
import { useState } from "react";

const PAGE_SIZE = 20;

const ACTION_LABEL: Record<AuditAction, string> = {
  ACTIVATE_ACCOUNT: "Cuenta activada",
  DEACTIVATE_ACCOUNT: "Cuenta desactivada",
  RESET_PASSWORD: "Contraseña restablecida",
  CHANGE_ROLE: "Rol cambiado",
  INVITE_VET: "Veterinario invitado",
};

const ACTION_STYLE: Record<AuditAction, string> = {
  ACTIVATE_ACCOUNT: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400",
  DEACTIVATE_ACCOUNT: "bg-muted text-muted-foreground",
  RESET_PASSWORD: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400",
  CHANGE_ROLE: "bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-400",
  INVITE_VET: "bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-400",
};

function formatDateTime(iso: string) {
  const [date, time] = iso.split("T");
  const [yyyy, mm, dd] = date.split("-");
  return `${dd}/${mm}/${yyyy} ${time ? time.slice(0, 5) : ""}`.trim();
}

export function AuditLogTab() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError } = useAuditLogs(page, PAGE_SIZE);
  const logs = data?.logs;

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-muted-foreground">
        Quién hizo qué sobre otras cuentas — aprobaciones, restablecimientos de contraseña, cambios de rol e
        invitaciones.
      </p>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Registro de acciones</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading && <TableSkeleton rows={5} />}

          {isError && <ErrorState message="No se pudo cargar el registro de auditoría." />}

          {!isLoading && !isError && logs?.length === 0 && (
            <EmptyState
              icon={History}
              title="Todavía no hay acciones registradas"
              description="Acá van a aparecer las aprobaciones, cambios de rol, restablecimientos de contraseña e invitaciones."
            />
          )}

          {!isLoading && !isError && logs && logs.length > 0 && (
            <>
              <MobileCardList>
                {logs.map((log) => (
                  <MobileCard
                    key={log.id}
                    title={ACTION_LABEL[log.action] ?? log.action}
                    subtitle={log.actor ? `${log.actor.firstName} ${log.actor.paternalLastName}` : "—"}
                    badge={
                      <span className="whitespace-nowrap text-xs text-muted-foreground">
                        {formatDateTime(log.date)}
                      </span>
                    }
                    rows={log.details ? [{ label: "Detalle", value: log.details }] : undefined}
                  />
                ))}
              </MobileCardList>

              <DesktopTable>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Acción</TableHead>
                      <TableHead>Realizada por</TableHead>
                      <TableHead>Detalle</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {logs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell className="whitespace-nowrap text-sm text-muted-foreground">{formatDateTime(log.date)}</TableCell>
                        <TableCell>
                          <Badge className={`border-none font-medium ${ACTION_STYLE[log.action]}`} variant="secondary">
                            {ACTION_LABEL[log.action] ?? log.action}
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
