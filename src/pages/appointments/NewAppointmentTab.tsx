import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/features/auth/AuthContext";
import type { AvailabilitySlot, Appointment } from "@/features/appointments/types";
import { useCreateAppointment, useAvailability, useRescheduleAppointment } from "@/features/appointments/useAppointments";
import { usePets } from "@/features/pets/usePets";
import { useMyVet } from "@/features/vets/useMyVet";
import { useVets } from "@/features/vets/useVets";
import { todayISO } from "@/lib/date";
import { SERVICE_TYPES } from "@/lib/service-types";
import { cn } from "@/lib/utils";
import { CalendarCheck2, Loader2, ShieldCheck, Sunrise, Sunset } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";

function formatLongDate(isoDate: string) {
  const [yyyy, mm, dd] = isoDate.split("-").map(Number);
  const date = new Date(yyyy, mm - 1, dd);
  const text = new Intl.DateTimeFormat("es-BO", { weekday: "long", day: "numeric", month: "long" }).format(date);
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function groupByHalfDay(slots: AvailabilitySlot[]) {
  return {
    morning: slots.filter((b) => b.time < "12:00"),
    afternoon: slots.filter((b) => b.time >= "12:00"),
  };
}

interface NewAppointmentTabProps {
  appointmentBeingEdited?: Appointment | null;
  onCompleted?: () => void;
}

export function NewAppointmentTab({ appointmentBeingEdited, onCompleted }: NewAppointmentTabProps) {
  const editing = !!appointmentBeingEdited;
  const { user } = useAuth();
  const isVet = user?.role === "VET";

  // El selector necesita el listado completo, no una página — 200 cubre la
  // escala real de una sola clínica sin necesitar un buscador acá.
  const { data: paginatedPets, isLoading: loadingPets } = usePets(1, 200);
  const pets = paginatedPets?.pets;
  const { data: vets, isLoading: loadingVets } = useVets(true);
  const { myVet } = useMyVet();
  const createAppointment = useCreateAppointment();
  const rescheduleAppointment = useRescheduleAppointment();

  const [petId, setPetId] = useState<string>(appointmentBeingEdited ? String(appointmentBeingEdited.pet.id) : "");
  const [vetId, setVetId] = useState<string>(appointmentBeingEdited ? String(appointmentBeingEdited.vet.id) : "");
  const [consultationType, setConsultationType] = useState<string>(appointmentBeingEdited?.consultationType ?? "");
  const [date, setDate] = useState(appointmentBeingEdited ? appointmentBeingEdited.dateTime.slice(0, 10) : todayISO());
  const [time, setTime] = useState<string>(appointmentBeingEdited ? appointmentBeingEdited.dateTime.slice(11, 16) : "");
  const [reason, setReason] = useState(appointmentBeingEdited?.reason ?? "");

  // Un veterinario no elige a quién agendarle: siempre es su propia agenda (solo aplica al crear).
  useEffect(() => {
    if (!editing && isVet && myVet && !vetId) {
      setVetId(String(myVet.id));
    }
  }, [editing, isVet, myVet, vetId]);

  const { data: slots, isLoading: loadingAvailability } = useAvailability(
    vetId ? Number(vetId) : undefined,
    date || undefined
  );
  const { morning, afternoon } = groupByHalfDay(slots ?? []);

  const ready = editing ? !!(date && time) : !!(petId && vetId && consultationType && date && time);
  const chosenPet = editing ? appointmentBeingEdited!.pet : pets?.find((m) => String(m.id) === petId);
  const chosenVet = editing ? appointmentBeingEdited!.vet : vets?.find((v) => String(v.id) === vetId);
  const submitting = editing ? rescheduleAppointment.isPending : createAppointment.isPending;

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!ready) return;

    if (editing) {
      await rescheduleAppointment.mutateAsync({ id: appointmentBeingEdited!.id, date, time });
      onCompleted?.();
      return;
    }

    await createAppointment.mutateAsync({
      petId: Number(petId),
      vetId: Number(vetId),
      date,
      time,
      consultationType,
      reason,
    });
    setTime("");
    setReason("");
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {editing && (
        <div className="rounded-md border bg-muted/40 p-3 text-sm">
          <p className="font-mono text-xs text-muted-foreground">{appointmentBeingEdited!.code}</p>
          <p className="font-medium">
            {appointmentBeingEdited!.pet.name} ({appointmentBeingEdited!.pet.species}) con {appointmentBeingEdited!.vet.firstName}{" "}
            {appointmentBeingEdited!.vet.paternalLastName} — {appointmentBeingEdited!.consultationType}
          </p>
          <p className="text-xs text-muted-foreground">Solo se puede cambiar la fecha y la hora al reprogramar.</p>
        </div>
      )}

      <div className={cn("grid grid-cols-1 gap-4", editing ? "sm:grid-cols-1 lg:max-w-xs" : "sm:grid-cols-2 lg:grid-cols-4")}>
        {!editing && (
          <>
            <div className="flex flex-col gap-2">
              <Label>Mascota</Label>
              <Select value={petId} onValueChange={setPetId} disabled={loadingPets}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Seleccione mascota" />
                </SelectTrigger>
                <SelectContent>
                  {pets?.map((m) => (
                    <SelectItem key={m.id} value={String(m.id)}>
                      {m.name} ({m.species}) — {m.owner.firstName} {m.owner.paternalLastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <Label>Veterinario</Label>
              {isVet ? (
                <div className="flex h-9 w-full items-center gap-2 rounded-md border bg-muted/40 px-3 text-sm">
                  <ShieldCheck className="size-4 shrink-0 text-primary" />
                  <span className="truncate">
                    {myVet ? `${myVet.firstName} ${myVet.paternalLastName}` : "Cargando…"}
                  </span>
                  <Badge variant="secondary" className="ml-auto shrink-0 text-[10px]">
                    Tú
                  </Badge>
                </div>
              ) : (
                <Select
                  value={vetId}
                  onValueChange={(v) => {
                    setVetId(v);
                    setTime("");
                  }}
                  disabled={loadingVets}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Seleccione veterinario" />
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
            </div>

            <div className="flex flex-col gap-2">
              <Label>Tipo de consulta</Label>
              <Select value={consultationType} onValueChange={setConsultationType}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Seleccione tipo" />
                </SelectTrigger>
                <SelectContent>
                  {SERVICE_TYPES.map((tipo) => (
                    <SelectItem key={tipo} value={tipo}>
                      {tipo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </>
        )}

        <div className="flex flex-col gap-2">
          <Label htmlFor="date">Fecha</Label>
          <input
            id="date"
            type="date"
            value={date}
            min={todayISO()}
            onChange={(e) => {
              setDate(e.target.value);
              setTime("");
            }}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
          />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <Label>Horarios disponibles</Label>
        {!vetId && (
          <p className="text-sm text-muted-foreground">
            {isVet ? "Elige una fecha para ver tu disponibilidad." : "Elige un veterinario y una fecha primero."}
          </p>
        )}
        {vetId && loadingAvailability && (
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-9 w-20" />
            ))}
          </div>
        )}
        {vetId && !loadingAvailability && (
          <div className="flex flex-col gap-4 sm:flex-row sm:gap-8">
            <FranjaHoraria icon={Sunrise} title="Mañana" slots={morning} selectedTime={time} onSelect={setTime} />
            <FranjaHoraria icon={Sunset} title="Tarde" slots={afternoon} selectedTime={time} onSelect={setTime} />
          </div>
        )}
      </div>

      {!editing && (
        <div className="flex flex-col gap-2">
          <Label htmlFor="reason">Motivo</Label>
          <Textarea
            id="reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Describa brevemente el motivo de la consulta"
            className="min-h-20"
          />
        </div>
      )}

      {ready && chosenPet && chosenVet && (
        <div className="flex items-start gap-3 rounded-lg border border-primary/20 bg-primary/5 p-4">
          <CalendarCheck2 className="mt-0.5 size-5 shrink-0 text-primary" />
          <p className="text-sm">
            {editing ? "Vas a reprogramar" : "Vas a agendar"} <span className="font-medium">{chosenPet.name}</span> con{" "}
            <span className="font-medium">
              {chosenVet.firstName} {chosenVet.paternalLastName}
            </span>{" "}
            el <span className="font-medium">{formatLongDate(date)}</span> a las{" "}
            <span className="font-medium">{time}</span>
            {!editing && ` — ${consultationType}`}.
          </p>
        </div>
      )}

      <div className="flex justify-end gap-2">
        <Button type="submit" disabled={!ready || submitting}>
          {submitting && <Loader2 className="size-4 animate-spin" />}
          {editing ? "Confirmar reprogramación" : "Agendar cita"}
        </Button>
      </div>
    </form>
  );
}

function FranjaHoraria({
  icon: Icono,
  title,
  slots,
  selectedTime,
  onSelect,
}: {
  icon: typeof Sunrise;
  title: string;
  slots: AvailabilitySlot[];
  selectedTime: string;
  onSelect: (time: string) => void;
}) {
  if (slots.length === 0) return null;

  return (
    <div className="flex flex-1 flex-col gap-2">
      <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
        <Icono className="size-3.5" />
        {title}
      </div>
      <div className="flex flex-wrap gap-2">
        {slots.map((bloque) => (
          <button
            type="button"
            key={bloque.time}
            disabled={!bloque.available}
            onClick={() => onSelect(bloque.time)}
            className={cn(
              "rounded-md border px-3 py-2 text-sm font-medium transition-colors",
              !bloque.available && "cursor-not-allowed bg-muted text-muted-foreground line-through",
              bloque.available && selectedTime !== bloque.time && "hover:bg-accent",
              bloque.available &&
                selectedTime === bloque.time &&
                "border-primary bg-primary text-primary-foreground"
            )}
          >
            {bloque.time}
          </button>
        ))}
      </div>
    </div>
  );
}
