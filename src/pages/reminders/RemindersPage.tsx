import { EmptyState } from "@/components/EmptyState";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TableSkeleton } from "@/components/TableSkeleton";
import {
  useReminderHistory,
  useMarkReminderSent,
  usePendingReminders,
} from "@/features/reminders/useReminders";
import { whatsappLink } from "@/lib/whatsapp";
import { useFormatters } from "@/lib/useFormatters";
import { CalendarClock, CheckCheck, MessageCircle, ShieldPlus } from "lucide-react";
import { useTranslation } from "react-i18next";

export function RemindersPage() {
  const { t } = useTranslation();
  const { formatDateTime } = useFormatters();
  const { data: reminders, isLoading, isError } = usePendingReminders();
  const { data: sent, isLoading: loadingSent } = useReminderHistory(5);
  const markSentMutation = useMarkReminderSent();

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{t("reminders.title")}</h1>
        <p className="text-muted-foreground">{t("reminders.subtitle")}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t("reminders.pendingTitle")}</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading && (
<TableSkeleton rows={3} />
          )}

          {isError && <p className="py-8 text-center text-sm text-destructive">{t("reminders.loadError")}</p>}

          {!isLoading && !isError && reminders?.length === 0 && (
            <EmptyState
              icon={MessageCircle}
              title={t("reminders.emptyTitle")}
              description={t("reminders.emptyDescription")}
            />
          )}

          {!isLoading && !isError && reminders && reminders.length > 0 && (
            <div className="flex flex-col divide-y">
              {reminders.map((reminder) => {
                const Icon = reminder.type === "APPOINTMENT" ? CalendarClock : ShieldPlus;
                return (
                  <div key={reminder.id} className="flex flex-wrap items-center gap-3 py-3">
                    <Icon className="size-5 shrink-0 text-muted-foreground" />
                    <div className="min-w-[220px] flex-1">
                      <p className="text-sm font-medium">{reminder.reference}</p>
                      <p className="text-xs text-muted-foreground">
                        {reminder.owner.firstName} {reminder.owner.paternalLastName} · {reminder.owner.phone}
                      </p>
                    </div>
                    <Button asChild size="sm">
                      <a
                        href={whatsappLink(reminder.owner.phone, reminder.message)}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <MessageCircle className="size-4" />
                        {t("reminders.sendOnWhatsapp")}
                      </a>
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={markSentMutation.isPending}
                      onClick={() => markSentMutation.mutate(reminder.id)}
                    >
                      {t("reminders.markSent")}
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t("reminders.latestTitle")}</CardTitle>
        </CardHeader>
        <CardContent>
          {loadingSent && (
<TableSkeleton rows={3} />
          )}

          {!loadingSent && sent?.length === 0 && (
            <div className="flex flex-col items-center gap-2 py-8 text-center text-muted-foreground">
              <CheckCheck className="size-7" />
              <p>{t("reminders.historyEmpty")}</p>
            </div>
          )}

          {!loadingSent && sent && sent.length > 0 && (
            <div className="flex flex-col divide-y">
              {sent.map((sent) => (
                <div key={sent.id} className="flex flex-wrap items-start justify-between gap-3 py-3">
                  <div className="min-w-[220px] flex-1">
                    <p className="text-sm font-medium">
                      {sent.owner.firstName} {sent.owner.paternalLastName}
                    </p>
                    <p className="text-xs text-muted-foreground">{sent.message}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <Badge variant="secondary" className="border-none font-normal">
                      WhatsApp
                    </Badge>
                    <span className="text-xs text-muted-foreground">{formatDateTime(sent.sentAt)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
