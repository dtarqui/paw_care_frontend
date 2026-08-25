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

function morning(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function etiquetaDelDia(isoDate: string) {
  if (isoDate === todayISO()) return "Hoy";
  if (isoDate === morning()) return "Mañana";
  const [yyyy, mm, dd] = isoDate.split("-").map(Number);
  const texto = new Intl.DateTimeFormat("es-BO", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date(yyyy, mm - 1, dd));
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

function agruparPorDia(appointments: Appointment[]) {
  const groups = new Map<string, Appointment[]>();
  for (const appointment of appointments) {
    const day = appointment.dateTime.slice(0, 10);
    if (!groups.has(day)) groups.set(day, []);
    groups.get(day)!.push(appointment);
  }
  return [...groups.entries()];
}

interface CitasListaTabProps {
  onReprogramar: (appointment: Appointment) => void;
}

export function AppointmentsListTab({ onReprogramar }: CitasListaTabProps) {
  const { user } = useAuth();
  const isVet = user?.role === "VET";
  const { myVet } = useMyVet();
  const [soloMisCitas, setSoloMisCitas] = useState(true);

  const { data: appointments, isLoading, isError } = useAppointments();
  const cambiarEstado = useChangeAppointmentStatus();

  const citasFiltradas = useMemo(() => {
    if (!appointments) return [];
    if (isVet && soloMisCitas && myVet) {
      return appointments.filter((c) => c.vet.id === myVet.id);
    }
    return appointments;
  }, [appointments, isVet, soloMisCitas, myVet]);

  const groups = useMemo(() => agruparPorDia(citasFiltradas), [citasFiltradas]);

  if (isLoading) {
    return (
<TableSkeleton rows={5} />
    );
  }

  if (isError) {
    return <p className="py-8 text-center text-sm text-destructive">No se pudo cargar la agenda.</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      {isVet && (
        <div className="flex items-center gap-2 self-start rounded-md border px-3 py-2">
          <Switch id="solo-mis-citas" checked={soloMisCitas} onCheckedChange={setSoloMisCitas} />
          <Label htmlFor="solo-mis-citas" className="cursor-pointer text-sm font-normal">
            Solo mis appointments
          </Label>
        </div>
      )}

      {groups.length === 0 && (
        <EmptyState
          icon={CalendarDays}
          title={soloMisCitas && isVet ? "No tienes citas asignadas todavía" : "No hay citas registradas todavía"}
          description="Agendá la primera desde la pestaña «Nueva Cita»."
        />
      )}

      {groups.map(([day, dayAppointments]) => (
        <Card key={day}>
          <CardHeader className="flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-foreground">{etiquetaDelDia(day)}</CardTitle>
            <span className="text-xs text-muted-foreground">
              {dayAppointments.length} {dayAppointments.length === 1 ? "cita" : "citas"}
            </span>
          </CardHeader>
          <CardContent className="divide-y p-0">
            {dayAppointments.map((appointment) => (
              <div key={appointment.id} title={appointment.code} className="flex flex-wrap items-center gap-3 px-6 py-3">
                <div className="w-14 shrink-0 font-semibold tabular-nums">{appointment.dateTime.slice(11, 16)}</div>

                <div className="min-w-[180px] flex-1">
                  <p className="font-medium">
                    {appointment.pet.name} <span className="font-normal text-muted-foreground">({appointment.pet.species})</span>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {appointment.vet.firstName} {appointment.vet.paternalLastName} · {appointment.consultationType}
                  </p>
                </div>

                <StatusBadge status={appointment.status} />

                <div className="flex shrink-0 flex-wrap justify-end gap-2">
                  {appointment.status === "CONFIRMED" ? (
                    <>
                      {/* Reprogramar es una acción de agenda: mismo criterio que crear (HU5) —
                          un veterinario solo reprograma su propia cita. */}
                      {(!isVet || appointment.vet.id === myVet?.id) && (
                        <Button size="sm" variant="outline" onClick={() => onReprogramar(appointment)}>
                          Reprogramar
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={cambiarEstado.isPending}
                        onClick={() => cambiarEstado.mutate({ id: appointment.id, status: "ATTENDED" })}
                      >
                        Marcar atendida
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-destructive hover:text-destructive"
                        disabled={cambiarEstado.isPending}
                        onClick={() => cambiarEstado.mutate({ id: appointment.id, status: "CANCELLED" })}
                      >
                        Cancelar
                      </Button>
                    </>
                  ) : (
                    <span className="text-xs text-muted-foreground">Sin acciones</span>
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
