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
import { CalendarClock, CheckCheck, MessageCircle, ShieldPlus } from "lucide-react";

function whatsappNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, "");
  return cleaned.startsWith("591") ? cleaned : `591${cleaned}`;
}

function whatsappLink(phone: string, message: string): string {
  return `https://wa.me/${whatsappNumber(phone)}?text=${encodeURIComponent(message)}`;
}

function formatDateTime(iso: string) {
  if (!iso) return "—";
  const [date, time] = iso.split("T");
  const [yyyy, mm, dd] = date.split("-");
  return `${dd}/${mm}/${yyyy} ${time ? time.slice(0, 5) : ""}`.trim();
}

export function RemindersPage() {
  const { data: reminders, isLoading, isError } = usePendingReminders();
  const { data: sent, isLoading: loadingSent } = useReminderHistory(5);
  const markSentMutation = useMarkReminderSent();

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Recordatorios</h1>
        <p className="text-muted-foreground">
          Citas en las próximas 24h y controles preventivos a 7 días — envío manual por WhatsApp, sin costo ni integración externa.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Pendientes de hoy</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading && (
<TableSkeleton rows={3} />
          )}

          {isError && <p className="py-8 text-center text-sm text-destructive">No se pudo cargar la lista.</p>}

          {!isLoading && !isError && reminders?.length === 0 && (
            <EmptyState
              icon={MessageCircle}
              title="No hay recordatorios pendientes"
              description="Acá aparecen las citas de las próximas 24 horas y los controles preventivos que vencen en 7 días."
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
                        Enviar por WhatsApp
                      </a>
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={markSentMutation.isPending}
                      onClick={() => markSentMutation.mutate(reminder.id)}
                    >
                      Marcar como enviado
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
          <CardTitle className="text-base">Últimos enviados</CardTitle>
        </CardHeader>
        <CardContent>
          {loadingSent && (
<TableSkeleton rows={3} />
          )}

          {!loadingSent && sent?.length === 0 && (
            <div className="flex flex-col items-center gap-2 py-8 text-center text-muted-foreground">
              <CheckCheck className="size-7" />
              <p>Todavía no se marcó ningún recordatorio como enviado.</p>
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
