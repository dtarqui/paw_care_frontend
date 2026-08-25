import { EmptyState } from "@/components/EmptyState";
import { StatusBadge } from "@/components/StatusBadge";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { PetHistoryEvent } from "@/features/pets/types";
import { CalendarDays, History, PenLine, Stethoscope, Syringe } from "lucide-react";
import type { ReactNode } from "react";

const CONTROL_TYPE_LABEL = { VACCINE: "Vacuna", DEWORMING: "Desparasitación" } as const;

function formatDateTime(literal: string) {
  const [date, time] = literal.split("T");
  const [yyyy, mm, dd] = date.split("-");
  return time ? `${dd}/${mm}/${yyyy} · ${time}` : `${dd}/${mm}/${yyyy}`;
}

function formatDate(iso: string) {
  if (!iso) return "—";
  const [yyyy, mm, dd] = iso.split("-");
  return `${dd}/${mm}/${yyyy}`;
}

function Row({
  icon,
  title,
  details,
  meta,
  badge,
}: {
  icon: ReactNode;
  title: ReactNode;
  details?: ReactNode;
  meta: string;
  badge?: ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 py-3">
      <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-medium">{title}</p>
          {badge}
        </div>
        {details && <p className="text-sm text-muted-foreground">{details}</p>}
        <p className="text-xs text-muted-foreground">{meta}</p>
      </div>
    </div>
  );
}

function EventRow({ event }: { event: PetHistoryEvent }) {
  if (event.type === "VISIT") {
    const { visit } = event;
    return (
      <Row
        icon={<Stethoscope className="size-4" />}
        title={visit.serviceType}
        details={
          <>
            <span className="font-medium text-foreground">Diagnóstico:</span> {visit.diagnosis}
            {visit.weight ? ` · Peso: ${visit.weight} kg` : ""}
          </>
        }
        meta={`${formatDateTime(visit.date)} · ${visit.vet.firstName} ${visit.vet.paternalLastName} · Bs. ${visit.consultationFee.toFixed(2)}`}
        badge={<StatusBadge status={visit.paymentStatus} />}
      />
    );
  }

  if (event.type === "PREVENTIVE_CONTROL") {
    const { control } = event;
    return (
      <Row
        icon={<Syringe className="size-4" />}
        title={CONTROL_TYPE_LABEL[control.type]}
        details={`Próxima dosis: ${formatDate(control.nextDoseOn)}`}
        meta={`Aplicada: ${formatDate(control.appliedOn)}`}
        badge={
          control.overdue ? (
            <Badge
              className={cn("border-none bg-red-100 font-medium text-red-700 dark:bg-red-500/15 dark:text-red-400")}
            >
              Vencido
            </Badge>
          ) : undefined
        }
      />
    );
  }

  if (event.type === "APPOINTMENT") {
    const { appointment } = event;
    return (
      <Row
        icon={<CalendarDays className="size-4" />}
        title={`${appointment.consultationType}${appointment.reason ? ` — ${appointment.reason}` : ""}`}
        meta={`${formatDateTime(appointment.dateTime)} · ${appointment.vet.firstName} ${appointment.vet.paternalLastName}`}
        badge={<StatusBadge status={appointment.status} />}
      />
    );
  }

  const { change } = event;
  return (
    <Row
      icon={<PenLine className="size-4" />}
      title={`Se editó "${change.field}"`}
      details={`${change.oldValue || "—"} → ${change.newValue || "—"}`}
      meta={`${formatDateTime(change.date)}${change.user ? ` · ${change.user}` : ""}`}
    />
  );
}

export function PetHistoryTimeline({ events }: { events: PetHistoryEvent[] }) {
  if (events.length === 0) {
    return (
      <EmptyState
        icon={History}
        title="Sin actividad registrada todavía"
        description="Las atenciones, controles, citas y ediciones de esta mascota van a aparecer acá en orden cronológico."
      />
    );
  }

  return (
    <div className="flex flex-col divide-y">
      {events.map((event, i) => (
        // eslint-disable-next-line react/no-array-index-key
        <EventRow key={`${event.type}-${i}`} event={event} />
      ))}
    </div>
  );
}
