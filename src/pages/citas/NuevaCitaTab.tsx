import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/features/auth/AuthContext";
import type { BloqueDisponibilidad, Cita } from "@/features/citas/types";
import { useCrearCita, useDisponibilidad, useReprogramarCita } from "@/features/citas/useCitas";
import { useMascotas } from "@/features/mascotas/useMascotas";
import { useMiVeterinario } from "@/features/veterinarios/useMiVeterinario";
import { useVeterinarios } from "@/features/veterinarios/useVeterinarios";
import { todayISO } from "@/lib/date";
import { TIPOS_SERVICIO } from "@/lib/tipos-servicio";
import { cn } from "@/lib/utils";
import { CalendarCheck2, Loader2, ShieldCheck, Sunrise, Sunset } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";

function formatearFechaLarga(fechaISO: string) {
  const [yyyy, mm, dd] = fechaISO.split("-").map(Number);
  const fecha = new Date(yyyy, mm - 1, dd);
  const texto = new Intl.DateTimeFormat("es-BO", { weekday: "long", day: "numeric", month: "long" }).format(fecha);
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

function agruparPorJornada(bloques: BloqueDisponibilidad[]) {
  return {
    manana: bloques.filter((b) => b.hora < "12:00"),
    tarde: bloques.filter((b) => b.hora >= "12:00"),
  };
}

interface NuevaCitaTabProps {
  citaEnEdicion?: Cita | null;
  onCompletado?: () => void;
}

export function NuevaCitaTab({ citaEnEdicion, onCompletado }: NuevaCitaTabProps) {
  const editando = !!citaEnEdicion;
  const { usuario } = useAuth();
  const esVeterinario = usuario?.rol === "VETERINARIO";

  // El selector necesita el listado completo, no una página — 200 cubre la
  // escala real de una sola clínica sin necesitar un buscador acá.
  const { data: mascotasPaginadas, isLoading: cargandoMascotas } = useMascotas(1, 200);
  const mascotas = mascotasPaginadas?.mascotas;
  const { data: veterinarios, isLoading: cargandoVeterinarios } = useVeterinarios(true);
  const { miVeterinario } = useMiVeterinario();
  const crearCita = useCrearCita();
  const reprogramarCita = useReprogramarCita();

  const [mascotaId, setMascotaId] = useState<string>(citaEnEdicion ? String(citaEnEdicion.mascota.id) : "");
  const [veterinarioId, setVeterinarioId] = useState<string>(citaEnEdicion ? String(citaEnEdicion.veterinario.id) : "");
  const [tipoConsulta, setTipoConsulta] = useState<string>(citaEnEdicion?.tipoConsulta ?? "");
  const [fecha, setFecha] = useState(citaEnEdicion ? citaEnEdicion.fechaHora.slice(0, 10) : todayISO());
  const [hora, setHora] = useState<string>(citaEnEdicion ? citaEnEdicion.fechaHora.slice(11, 16) : "");
  const [motivo, setMotivo] = useState(citaEnEdicion?.motivo ?? "");

  // Un veterinario no elige a quién agendarle: siempre es su propia agenda (solo aplica al crear).
  useEffect(() => {
    if (!editando && esVeterinario && miVeterinario && !veterinarioId) {
      setVeterinarioId(String(miVeterinario.id));
    }
  }, [editando, esVeterinario, miVeterinario, veterinarioId]);

  const { data: bloques, isLoading: cargandoDisponibilidad } = useDisponibilidad(
    veterinarioId ? Number(veterinarioId) : undefined,
    fecha || undefined
  );
  const { manana, tarde } = agruparPorJornada(bloques ?? []);

  const listo = editando ? !!(fecha && hora) : !!(mascotaId && veterinarioId && tipoConsulta && fecha && hora);
  const mascotaElegida = editando ? citaEnEdicion!.mascota : mascotas?.find((m) => String(m.id) === mascotaId);
  const veterinarioElegido = editando ? citaEnEdicion!.veterinario : veterinarios?.find((v) => String(v.id) === veterinarioId);
  const enviando = editando ? reprogramarCita.isPending : crearCita.isPending;

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!listo) return;

    if (editando) {
      await reprogramarCita.mutateAsync({ id: citaEnEdicion!.id, fecha, hora });
      onCompletado?.();
      return;
    }

    await crearCita.mutateAsync({
      mascotaId: Number(mascotaId),
      veterinarioId: Number(veterinarioId),
      fecha,
      hora,
      tipoConsulta,
      motivo,
    });
    setHora("");
    setMotivo("");
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {editando && (
        <div className="rounded-md border bg-muted/40 p-3 text-sm">
          <p className="font-mono text-xs text-muted-foreground">{citaEnEdicion!.codigo}</p>
          <p className="font-medium">
            {citaEnEdicion!.mascota.nombre} ({citaEnEdicion!.mascota.especie}) con {citaEnEdicion!.veterinario.nombre}{" "}
            {citaEnEdicion!.veterinario.apellidoPaterno} — {citaEnEdicion!.tipoConsulta}
          </p>
          <p className="text-xs text-muted-foreground">Solo se puede cambiar la fecha y hora al reprogramar.</p>
        </div>
      )}

      <div className={cn("grid grid-cols-1 gap-4", editando ? "sm:grid-cols-1 lg:max-w-xs" : "sm:grid-cols-2 lg:grid-cols-4")}>
        {!editando && (
          <>
            <div className="flex flex-col gap-2">
              <Label>Mascota</Label>
              <Select value={mascotaId} onValueChange={setMascotaId} disabled={cargandoMascotas}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Seleccione mascota" />
                </SelectTrigger>
                <SelectContent>
                  {mascotas?.map((m) => (
                    <SelectItem key={m.id} value={String(m.id)}>
                      {m.nombre} ({m.especie}) — {m.propietario.nombre} {m.propietario.apellidoPaterno}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <Label>Veterinario</Label>
              {esVeterinario ? (
                <div className="flex h-9 w-full items-center gap-2 rounded-md border bg-muted/40 px-3 text-sm">
                  <ShieldCheck className="size-4 shrink-0 text-primary" />
                  <span className="truncate">
                    {miVeterinario ? `${miVeterinario.nombre} ${miVeterinario.apellidoPaterno}` : "Cargando…"}
                  </span>
                  <Badge variant="secondary" className="ml-auto shrink-0 text-[10px]">
                    Tú
                  </Badge>
                </div>
              ) : (
                <Select
                  value={veterinarioId}
                  onValueChange={(v) => {
                    setVeterinarioId(v);
                    setHora("");
                  }}
                  disabled={cargandoVeterinarios}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Seleccione veterinario" />
                  </SelectTrigger>
                  <SelectContent>
                    {veterinarios?.map((v) => (
                      <SelectItem key={v.id} value={String(v.id)}>
                        {v.nombre} {v.apellidoPaterno} — {v.especialidad}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label>Tipo de consulta</Label>
              <Select value={tipoConsulta} onValueChange={setTipoConsulta}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Seleccione tipo" />
                </SelectTrigger>
                <SelectContent>
                  {TIPOS_SERVICIO.map((tipo) => (
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
          <Label htmlFor="fecha">Fecha</Label>
          <input
            id="fecha"
            type="date"
            value={fecha}
            min={todayISO()}
            onChange={(e) => {
              setFecha(e.target.value);
              setHora("");
            }}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
          />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <Label>Horarios disponibles</Label>
        {!veterinarioId && (
          <p className="text-sm text-muted-foreground">
            {esVeterinario ? "Elige una fecha para ver tu disponibilidad." : "Elige un veterinario y una fecha primero."}
          </p>
        )}
        {veterinarioId && cargandoDisponibilidad && (
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-9 w-20" />
            ))}
          </div>
        )}
        {veterinarioId && !cargandoDisponibilidad && (
          <div className="flex flex-col gap-4 sm:flex-row sm:gap-8">
            <FranjaHoraria icono={Sunrise} titulo="Mañana" bloques={manana} horaSeleccionada={hora} onSeleccionar={setHora} />
            <FranjaHoraria icono={Sunset} titulo="Tarde" bloques={tarde} horaSeleccionada={hora} onSeleccionar={setHora} />
          </div>
        )}
      </div>

      {!editando && (
        <div className="flex flex-col gap-2">
          <Label htmlFor="motivo">Motivo</Label>
          <Textarea
            id="motivo"
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            placeholder="Describa brevemente el motivo de la consulta"
            className="min-h-20"
          />
        </div>
      )}

      {listo && mascotaElegida && veterinarioElegido && (
        <div className="flex items-start gap-3 rounded-lg border border-primary/20 bg-primary/5 p-4">
          <CalendarCheck2 className="mt-0.5 size-5 shrink-0 text-primary" />
          <p className="text-sm">
            {editando ? "Vas a reprogramar" : "Vas a agendar"} <span className="font-medium">{mascotaElegida.nombre}</span> con{" "}
            <span className="font-medium">
              {veterinarioElegido.nombre} {veterinarioElegido.apellidoPaterno}
            </span>{" "}
            el <span className="font-medium">{formatearFechaLarga(fecha)}</span> a las{" "}
            <span className="font-medium">{hora}</span>
            {!editando && ` — ${tipoConsulta}`}.
          </p>
        </div>
      )}

      <div className="flex justify-end gap-2">
        <Button type="submit" disabled={!listo || enviando}>
          {enviando && <Loader2 className="size-4 animate-spin" />}
          {editando ? "Confirmar reprogramación" : "Agendar cita"}
        </Button>
      </div>
    </form>
  );
}

function FranjaHoraria({
  icono: Icono,
  titulo,
  bloques,
  horaSeleccionada,
  onSeleccionar,
}: {
  icono: typeof Sunrise;
  titulo: string;
  bloques: BloqueDisponibilidad[];
  horaSeleccionada: string;
  onSeleccionar: (hora: string) => void;
}) {
  if (bloques.length === 0) return null;

  return (
    <div className="flex flex-1 flex-col gap-2">
      <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
        <Icono className="size-3.5" />
        {titulo}
      </div>
      <div className="flex flex-wrap gap-2">
        {bloques.map((bloque) => (
          <button
            type="button"
            key={bloque.hora}
            disabled={!bloque.disponible}
            onClick={() => onSeleccionar(bloque.hora)}
            className={cn(
              "rounded-md border px-3 py-2 text-sm font-medium transition-colors",
              !bloque.disponible && "cursor-not-allowed bg-muted text-muted-foreground line-through",
              bloque.disponible && horaSeleccionada !== bloque.hora && "hover:bg-accent",
              bloque.disponible &&
                horaSeleccionada === bloque.hora &&
                "border-primary bg-primary text-primary-foreground"
            )}
          >
            {bloque.hora}
          </button>
        ))}
      </div>
    </div>
  );
}
