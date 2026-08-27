import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TableSkeleton } from "@/components/TableSkeleton";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/features/auth/AuthContext";
import type { ScheduleBlockInput, Schedule } from "@/features/schedules/types";
import { useUpdateSchedules, useSchedules } from "@/features/schedules/useSchedules";
import { useMyVet } from "@/features/vets/useMyVet";
import { useVets } from "@/features/vets/useVets";
import { Loader2, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

/** Lunes primero, como se lee un horario de atención. El 0 es domingo en el
 * backend, así que va al final. Las etiquetas salen de `schedules.days.*`. */
const DAYS = [1, 2, 3, 4, 5, 6, 0];

interface Shift {
  enabled: boolean;
  start: string;
  end: string;
}

interface DayState {
  morningShift: Shift;
  afternoonShift: Shift;
}

type WeekState = Record<number, DayState>;

function emptyState(): WeekState {
  const week: WeekState = {};
  for (const day of DAYS) {
    week[day] = {
      morningShift: { enabled: false, start: "08:00", end: "12:00" },
      afternoonShift: { enabled: false, start: "14:00", end: "16:30" },
    };
  }
  return week;
}

function stateFromSchedules(schedules: Schedule[]): WeekState {
  const week = emptyState();
  for (const day of DAYS) {
    const rows = schedules.filter((h) => h.dayOfWeek === day).sort((a, b) => a.startTime.localeCompare(b.startTime));
    // El backend no guarda a qué switch (turno de mañana/tarde) pertenece cada bloque —
    // solo una lista plana de horarios. Se reconstruye por hora del día (antes/después
    // del mediodía) en vez de por orden de llegada, para que un día con solo turno de
    // tarde no se muestre encendido en el switch de "mañana" al recargar.
    const morning = rows.find((f) => f.startTime < "12:00");
    const afternoon = rows.find((f) => f !== morning && f.startTime >= "12:00") ?? rows.find((f) => f !== morning);
    if (morning) week[day].morningShift = { enabled: true, start: morning.startTime, end: morning.endTime };
    if (afternoon) week[day].afternoonShift = { enabled: true, start: afternoon.startTime, end: afternoon.endTime };
  }
  return week;
}

function toInput(week: WeekState): ScheduleBlockInput[] {
  const result: ScheduleBlockInput[] = [];
  for (const day of DAYS) {
    const { morningShift, afternoonShift } = week[day];
    if (morningShift.enabled) result.push({ dayOfWeek: day, startTime: morningShift.start, endTime: morningShift.end });
    if (afternoonShift.enabled) result.push({ dayOfWeek: day, startTime: afternoonShift.start, endTime: afternoonShift.end });
  }
  return result;
}

export function SchedulesTab() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const isVet = user?.role === "VET";
  const { data: vets, isLoading: loadingVets } = useVets();
  const { myVet } = useMyVet();
  const [selectedVetId, setSelectedVetId] = useState<number | undefined>();

  const vetId = isVet ? myVet?.id : selectedVetId;
  const currentVet = isVet ? myVet : vets?.find((v) => v.id === vetId);

  const { data: schedules, isLoading: loadingSchedules } = useSchedules(vetId);
  const updateSchedulesMutation = useUpdateSchedules(vetId);

  const [week, setWeek] = useState<WeekState>(emptyState());
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (schedules) setWeek(stateFromSchedules(schedules));
  }, [schedules]);

  function updateShift(day: number, shift: "morningShift" | "afternoonShift", changes: Partial<Shift>) {
    setWeek((prev) => ({ ...prev, [day]: { ...prev[day], [shift]: { ...prev[day][shift], ...changes } } }));
  }

  async function save() {
    setError(null);
    const input = toInput(week);
    for (const slot of input) {
      if (slot.startTime >= slot.endTime) {
        setError(t("schedules.startBeforeEnd"));
        return;
      }
    }
    try {
      await updateSchedulesMutation.mutateAsync(input);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("schedules.saveError"));
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <CardTitle className="text-base">{t("common.vet")}</CardTitle>
          {isVet ? (
            <div className="flex h-9 items-center gap-2 rounded-md border bg-muted/40 px-3 text-sm">
              <ShieldCheck className="size-4 shrink-0 text-primary" />
              <span className="truncate">{myVet ? `${myVet.firstName} ${myVet.paternalLastName}` : t("common.loading")}</span>
              <Badge variant="secondary" className="ml-auto shrink-0 text-[10px]">
                {t("common.you")}
              </Badge>
            </div>
          ) : (
            <Select
              value={selectedVetId ? String(selectedVetId) : ""}
              onValueChange={(v) => setSelectedVetId(Number(v))}
              disabled={loadingVets}
            >
              <SelectTrigger className="w-64">
                <SelectValue placeholder={t("schedules.pickVet")} />
              </SelectTrigger>
              <SelectContent>
                {vets?.map((v) => (
                  <SelectItem key={v.id} value={String(v.id)}>
                    {v.firstName} {v.paternalLastName} — {v.specialty}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </CardHeader>
      </Card>

      {!vetId && !isVet && (
        <p className="py-6 text-center text-sm text-muted-foreground">{t("schedules.pickVetHint")}</p>
      )}

      {vetId && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              {t("schedules.week")}{" "}
              {currentVet ? `— ${currentVet.firstName} ${currentVet.paternalLastName}` : ""}
            </CardTitle>
            <p className="text-sm text-muted-foreground">{t("schedules.shiftsHint")}</p>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {loadingSchedules ? (
<TableSkeleton rows={7} />
            ) : (
              <div className="flex flex-col divide-y">
                {DAYS.map((day) => (
                  <div key={day} className="flex flex-col gap-3 py-3 sm:flex-row sm:items-center">
                    <span className="w-24 shrink-0 text-sm font-medium">{t(`schedules.days.${day}`)}</span>
                    <div className="flex flex-1 flex-wrap gap-4">
                      {(["morningShift", "afternoonShift"] as const).map((shiftKey) => {
                        const shift = week[day][shiftKey];
                        return (
                          <div key={shiftKey} className="flex items-center gap-2">
                            <Switch
                              checked={shift.enabled}
                              onCheckedChange={(enabled) => updateShift(day, shiftKey, { enabled })}
                            />
                            <Input
                              type="time"
                              className="w-28"
                              value={shift.start}
                              disabled={!shift.enabled}
                              onChange={(e) => updateShift(day, shiftKey, { start: e.target.value })}
                            />
                            <span className="text-muted-foreground">–</span>
                            <Input
                              type="time"
                              className="w-28"
                              value={shift.end}
                              disabled={!shift.enabled}
                              onChange={(e) => updateShift(day, shiftKey, { end: e.target.value })}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {error && <p className="text-sm text-destructive">{error}</p>}

            <div className="flex justify-end">
              <Button onClick={save} disabled={updateSchedulesMutation.isPending || loadingSchedules}>
                {updateSchedulesMutation.isPending && <Loader2 className="size-4 animate-spin" />}
                {t("schedules.save")}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
