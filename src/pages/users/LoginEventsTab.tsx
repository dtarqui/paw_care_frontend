import { EmptyState, ErrorState } from "@/components/EmptyState";
import { DesktopTable, MobileCard, MobileCardList } from "@/components/MobileCard";
import { Pagination } from "@/components/Pagination";
import { StatTile } from "@/components/StatTile";
import { TableSkeleton } from "@/components/TableSkeleton";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { LoginEvent, LoginEventFilter } from "@/features/login-events/types";
import { useLoginEvents } from "@/features/login-events/useLoginEvents";
import { summarizeUserAgent } from "@/lib/userAgent";
import { useFormatters } from "@/lib/useFormatters";
import { cn } from "@/lib/utils";
import { LogIn, ShieldAlert } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const PAGE_SIZE = 20;

/** Verde para el ingreso, rojo para el intento fallido: acá el color es la
 * información principal — se recorre la lista buscando lo que salió mal. */
const OUTCOME_STYLE: Record<string, string> = {
  SUCCESS: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400",
  INVALID_CREDENTIALS: "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400",
  INACTIVE_ACCOUNT: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400",
};

function OutcomeBadge({ outcome }: { outcome: LoginEvent["outcome"] }) {
  const { t } = useTranslation();
  return (
    <Badge className={cn("border-none font-medium", OUTCOME_STYLE[outcome])} variant="secondary">
      {t(`logins.outcomes.${outcome}`)}
    </Badge>
  );
}

/** Quién intentó entrar: el nombre si la cuenta existe, y siempre el usuario tecleado
 * — en un intento fallido ese texto es justamente el dato interesante. */
function Who({ event }: { event: LoginEvent }) {
  return (
    <div className="flex min-w-0 flex-col">
      <span className="truncate font-medium">
        {event.user ? `${event.user.firstName} ${event.user.paternalLastName}` : event.username}
      </span>
      <span className="truncate text-xs text-muted-foreground">
        {event.user ? event.username : ""}
      </span>
    </div>
  );
}

export function LoginEventsTab() {
  const { t } = useTranslation();
  const { formatDateTime } = useFormatters();
  const [page, setPage] = useState(1);
  const [outcome, setOutcome] = useState<LoginEventFilter>("all");
  const [username, setUsername] = useState("");

  const { data, isLoading, isError } = useLoginEvents(page, PAGE_SIZE, outcome, username);
  const events = data?.events;

  function changeFilter(next: LoginEventFilter) {
    setOutcome(next);
    setPage(1);
  }

  function changeUsername(next: string) {
    setUsername(next);
    setPage(1);
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-muted-foreground">{t("logins.intro")}</p>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <StatTile
          label={t("logins.successesToday")}
          value={data?.summary.successes ?? 0}
          icon={LogIn}
          isLoading={isLoading}
        />
        <StatTile
          label={t("logins.failuresToday")}
          value={data?.summary.failures ?? 0}
          icon={ShieldAlert}
          isLoading={isLoading}
          tone={data && data.summary.failures > 0 ? "warning" : "default"}
        />
      </div>

      <Card>
        <CardHeader className="flex-col items-stretch gap-3 space-y-0 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-base">{t("logins.cardTitle")}</CardTitle>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
            <div className="flex flex-col gap-1.5 sm:w-52">
              <Label htmlFor="login-username" className="sr-only">
                {t("logins.filterByUser")}
              </Label>
              <Input
                id="login-username"
                value={username}
                onChange={(e) => changeUsername(e.target.value)}
                placeholder={t("logins.filterByUser")}
              />
            </div>
            <Select value={outcome} onValueChange={(v) => changeFilter(v as LoginEventFilter)}>
              <SelectTrigger className="w-full sm:w-44">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("logins.filters.all")}</SelectItem>
                <SelectItem value="success">{t("logins.filters.success")}</SelectItem>
                <SelectItem value="failed">{t("logins.filters.failed")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading && <TableSkeleton rows={5} />}

          {isError && <ErrorState message={t("logins.loadError")} />}

          {!isLoading && !isError && events?.length === 0 && (
            <EmptyState
              icon={LogIn}
              title={username || outcome !== "all" ? t("logins.noMatch") : t("logins.emptyTitle")}
              description={
                username || outcome !== "all" ? t("logins.noMatchDescription") : t("logins.emptyDescription")
              }
            />
          )}

          {!isLoading && !isError && events && events.length > 0 && (
            <>
              <MobileCardList>
                {events.map((event) => (
                  <MobileCard
                    key={event.id}
                    title={event.user ? `${event.user.firstName} ${event.user.paternalLastName}` : event.username}
                    subtitle={event.user ? event.username : undefined}
                    badge={<OutcomeBadge outcome={event.outcome} />}
                    rows={[
                      { label: t("common.date"), value: formatDateTime(event.date) },
                      { label: t("logins.ipAddress"), value: event.ipAddress ?? "—" },
                      {
                        label: t("logins.device"),
                        value: summarizeUserAgent(event.userAgent) ?? "—",
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
                      <TableHead>{t("logins.who")}</TableHead>
                      <TableHead>{t("common.status")}</TableHead>
                      <TableHead>{t("logins.ipAddress")}</TableHead>
                      <TableHead>{t("logins.device")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {events.map((event) => (
                      <TableRow key={event.id}>
                        <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                          {formatDateTime(event.date)}
                        </TableCell>
                        <TableCell>
                          <Who event={event} />
                        </TableCell>
                        <TableCell>
                          <OutcomeBadge outcome={event.outcome} />
                        </TableCell>
                        <TableCell className="tabular-nums">{event.ipAddress ?? "—"}</TableCell>
                        {/* El user agent completo, al pasar el mouse: el resumen alcanza
                            para mirar la lista, el crudo sirve cuando algo no cuadra. */}
                        <TableCell className="text-sm text-muted-foreground" title={event.userAgent}>
                          {summarizeUserAgent(event.userAgent) ?? "—"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </DesktopTable>

              {data && (
                <Pagination page={data.page} pageSize={data.pageSize} total={data.total} onPageChange={setPage} />
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
