import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/features/auth/AuthContext";
import type { Appointment } from "@/features/appointments/types";
import { useChangeAppointmentStatus, useAppointments } from "@/features/appointments/useAppointments";
import { useMyVet } from "@/features/vets/useMyVet";
import { todayISO } from "@/lib/date";
import { CalendarDays } from "lucide-react";
import { useMemo, useState } from "react";

function manana(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function etiquetaDelDia(fechaISO: string) {
  if (fechaISO === todayISO()) return "Hoy";
  if (fechaISO === manana()) return "Mañana";
  const [yyyy, mm, dd] = fechaISO.split("-").map(Number);
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
    const dia = appointment.dateTime.slice(0, 10);
    if (!groups.has(dia)) groups.set(dia, []);
    groups.get(dia)!.push(appointment);
  }
  return [...groups.entries()];
}

interface CitasListaTabProps {
  onReprogramar: (appointment: Appointment) => void;
}

export function AppointmentsListTab({ onReprogramar }: CitasListaTabProps) {
  const { user } = useAuth();
  const esVeterinario = user?.role === "VET";
  const { myVet } = useMyVet();
  const [soloMisCitas, setSoloMisCitas] = useState(true);

  const { data: appointments, isLoading, isError } = useAppointments();
  const cambiarEstado = useChangeAppointmentStatus();

  const citasFiltradas = useMemo(() => {
    if (!appointments) return [];
    if (esVeterinario && soloMisCitas && myVet) {
      return appointments.filter((c) => c.vet.id === myVet.id);
    }
    return appointments;
  }, [appointments, esVeterinario, soloMisCitas, myVet]);

  const groups = useMemo(() => agruparPorDia(citasFiltradas), [citasFiltradas]);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-14 w-full" />
        ))}
      </div>
    );
  }

  if (isError) {
    return <p className="py-8 text-center text-sm text-destructive">No se pudo cargar la agenda.</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      {esVeterinario && (
        <div className="flex items-center gap-2 self-start rounded-md border px-3 py-2">
          <Switch id="solo-mis-citas" checked={soloMisCitas} onCheckedChange={setSoloMisCitas} />
          <Label htmlFor="solo-mis-citas" className="cursor-pointer text-sm font-normal">
            Solo mis appointments
          </Label>
        </div>
      )}

      {groups.length === 0 && (
        <div className="flex flex-col items-center gap-2 py-12 text-center text-muted-foreground">
          <CalendarDays className="size-8" />
          <p>{soloMisCitas && esVeterinario ? "No tienes citas asignadas todavía." : "No hay citas registradas todavía."}</p>
        </div>
      )}

      {groups.map(([dia, citasDelDia]) => (
        <Card key={dia}>
          <CardHeader className="flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-foreground">{etiquetaDelDia(dia)}</CardTitle>
            <span className="text-xs text-muted-foreground">
              {citasDelDia.length} {citasDelDia.length === 1 ? "cita" : "citas"}
            </span>
          </CardHeader>
          <CardContent className="divide-y p-0">
            {citasDelDia.map((appointment) => (
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
                      {(!esVeterinario || appointment.vet.id === myVet?.id) && (
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
