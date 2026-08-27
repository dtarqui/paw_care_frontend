import { EmptyState } from "@/components/EmptyState";
import { StatusBadge } from "@/components/StatusBadge";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { PetHistoryEvent } from "@/features/pets/types";
import { CalendarDays, History, PenLine, Stethoscope, Syringe } from "lucide-react";
import { useFormatters } from "@/lib/useFormatters";
import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import type { TFunction } from "i18next";

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

interface EventRowProps {
  event: PetHistoryEvent;
  t: TFunction;
  formatDate: (iso: string) => string;
  formatDateTime: (iso: string) => string;
}

function EventRow({ event, t, formatDate, formatDateTime }: EventRowProps) {
  if (event.type === "VISIT") {
    const { visit } = event;
    return (
      <Row
        icon={<Stethoscope className="size-4" />}
        title={visit.serviceType}
        details={
          <>
            <span className="font-medium text-foreground">{t("visits.diagnosisLabel")}</span> {visit.diagnosis}
            {visit.weight ? ` · ${t("pets.weight")}: ${visit.weight} kg` : ""}
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
        title={t(`enums.controlType.${control.type}`)}
        details={t("preventive.nextDoseOn", { date: formatDate(control.nextDoseOn) })}
        meta={t("preventive.appliedOn", { date: formatDate(control.appliedOn) })}
        badge={
          control.overdue ? (
            <Badge
              className={cn("border-none bg-red-100 font-medium text-red-700 dark:bg-red-500/15 dark:text-red-400")}
            >
              {t("common.expired")}
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
      title={t("pets.fieldEdited", { field: change.field })}
      details={`${change.oldValue || "—"} → ${change.newValue || "—"}`}
      meta={`${formatDateTime(change.date)}${change.user ? ` · ${change.user}` : ""}`}
    />
  );
}

export function PetHistoryTimeline({ events }: { events: PetHistoryEvent[] }) {
  const { t } = useTranslation();
  const { formatDate, formatDateTime } = useFormatters();

  if (events.length === 0) {
    return (
      <EmptyState
        icon={History}
        title={t("pets.timelineEmptyTitle")}
        description={t("pets.timelineEmptyDescription")}
      />
    );
  }

  return (
    <div className="flex flex-col divide-y">
      {events.map((event, i) => (
        // eslint-disable-next-line react/no-array-index-key
        <EventRow key={`${event.type}-${i}`} event={event} t={t} formatDate={formatDate} formatDateTime={formatDateTime} />
      ))}
    </div>
  );
}
