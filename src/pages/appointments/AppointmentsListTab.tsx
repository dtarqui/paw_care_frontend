import { EmptyState } from "@/components/EmptyState";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { TableSkeleton } from "@/components/TableSkeleton";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/features/auth/AuthContext";
import type { Appointment } from "@/features/appointments/types";
import { useChangeAppointmentStatus, useAppointments } from "@/features/appointments/useAppointments";
import { useMyVet } from "@/features/vets/useMyVet";
import { todayISO } from "@/lib/date";
import { CalendarDays } from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import type { TFunction } from "i18next";

function tomorrowISO(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

/** "Hoy" / "Mañana" cuando aplica; si no, el día de la semana en el idioma actual. */
function dayLabel(isoDate: string, t: TFunction, language: string) {
  if (isoDate === todayISO()) return t("appointments.today");
  if (isoDate === tomorrowISO()) return t("appointments.tomorrow");
  const [yyyy, mm, dd] = isoDate.split("-").map(Number);
  const text = new Intl.DateTimeFormat(language.startsWith("en") ? "en-GB" : "es-BO", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date(yyyy, mm - 1, dd));
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function groupByDay(appointments: Appointment[]) {
  const groups = new Map<string, Appointment[]>();
  for (const appointment of appointments) {
    const day = appointment.dateTime.slice(0, 10);
    if (!groups.has(day)) groups.set(day, []);
    groups.get(day)!.push(appointment);
  }
  return [...groups.entries()];
}

interface AppointmentsListTabProps {
  onReschedule: (appointment: Appointment) => void;
}

export function AppointmentsListTab({ onReschedule }: AppointmentsListTabProps) {
  const { t, i18n } = useTranslation();
  const language = i18n.resolvedLanguage ?? i18n.language;
  const { user } = useAuth();
  const isVet = user?.role === "VET";
  const { myVet } = useMyVet();
  const [onlyMyAppointments, setOnlyMyAppointments] = useState(true);

  const { data: appointments, isLoading, isError } = useAppointments();
  const changeStatusMutation = useChangeAppointmentStatus();

  const filteredAppointments = useMemo(() => {
    if (!appointments) return [];
    if (isVet && onlyMyAppointments && myVet) {
      return appointments.filter((c) => c.vet.id === myVet.id);
    }
    return appointments;
  }, [appointments, isVet, onlyMyAppointments, myVet]);

  const groups = useMemo(() => groupByDay(filteredAppointments), [filteredAppointments]);

  if (isLoading) {
    return (
<TableSkeleton rows={5} />
    );
  }

  if (isError) {
    return <p className="py-8 text-center text-sm text-destructive">{t("appointments.loadError")}</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      {isVet && (
        <div className="flex items-center gap-2 self-start rounded-md border px-3 py-2">
          <Switch id="only-my-appointments" checked={onlyMyAppointments} onCheckedChange={setOnlyMyAppointments} />
          <Label htmlFor="only-my-appointments" className="cursor-pointer text-sm font-normal">
            {t("appointments.onlyMine")}
          </Label>
        </div>
      )}

      {groups.length === 0 && (
        <EmptyState
          icon={CalendarDays}
          title={onlyMyAppointments && isVet ? t("appointments.emptyMine") : t("appointments.emptyAll")}
          description={t("appointments.emptyDescription")}
        />
      )}

      {groups.map(([day, dayAppointments]) => (
        <Card key={day}>
          <CardHeader className="flex-row flex-wrap items-center justify-between gap-x-3 gap-y-1 space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-foreground">{dayLabel(day, t, language)}</CardTitle>
            <span className="text-xs text-muted-foreground">
              {t("appointments.count", { count: dayAppointments.length })}
            </span>
          </CardHeader>
          <CardContent className="divide-y p-0">
            {dayAppointments.map((appointment) => (
              <div key={appointment.id} title={appointment.code} className="flex flex-wrap items-center gap-3 px-6 py-3">
                <div className="w-14 shrink-0 font-semibold tabular-nums">{appointment.dateTime.slice(11, 16)}</div>

                <div className="min-w-[180px] flex-1">
                  <p className="font-medium">
                    {appointment.pet.name}{" "}
                    <span className="font-normal text-muted-foreground">
                      ({t(`enums.species.${appointment.pet.species}`, { defaultValue: appointment.pet.species })})
                    </span>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {appointment.vet.firstName} {appointment.vet.paternalLastName} ·{" "}
                    {t(`enums.serviceType.${appointment.consultationType}`, {
                      defaultValue: appointment.consultationType,
                    })}
                  </p>
                </div>

                <StatusBadge status={appointment.status} />

                <div className="flex shrink-0 flex-wrap justify-end gap-2">
                  {appointment.status === "CONFIRMED" ? (
                    <>
                      {/* Reprogramar es una acción de agenda: mismo criterio que crear (HU5) —
                          un veterinario solo reprograma su propia cita. */}
                      {(!isVet || appointment.vet.id === myVet?.id) && (
                        <Button size="sm" variant="outline" onClick={() => onReschedule(appointment)}>
                          {t("appointments.reschedule")}
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={changeStatusMutation.isPending}
                        onClick={() => changeStatusMutation.mutate({ id: appointment.id, status: "ATTENDED" })}
                      >
                        {t("appointments.markAttended")}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-destructive hover:text-destructive"
                        disabled={changeStatusMutation.isPending}
                        onClick={() => changeStatusMutation.mutate({ id: appointment.id, status: "CANCELLED" })}
                      >
                        {t("common.cancel")}
                      </Button>
                    </>
                  ) : (
                    <span className="text-xs text-muted-foreground">{t("appointments.noActions")}</span>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
