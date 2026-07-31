import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/features/auth/AuthContext";
import type { BloqueHorarioInput, Horario } from "@/features/horarios/types";
import { useActualizarHorarios, useHorarios } from "@/features/horarios/useHorarios";
import { useMiVeterinario } from "@/features/veterinarios/useMiVeterinario";
import { useVeterinarios } from "@/features/veterinarios/useVeterinarios";
import { Loader2, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";

const DIAS = [
  { valor: 1, etiqueta: "Lunes" },
  { valor: 2, etiqueta: "Martes" },
  { valor: 3, etiqueta: "Miércoles" },
  { valor: 4, etiqueta: "Jueves" },
  { valor: 5, etiqueta: "Viernes" },
  { valor: 6, etiqueta: "Sábado" },
  { valor: 0, etiqueta: "Domingo" },
];

interface Turno {
  activo: boolean;
  inicio: string;
  fin: string;
}

interface DiaState {
  turno1: Turno;
  turno2: Turno;
}

type SemanaState = Record<number, DiaState>;

function estadoVacio(): SemanaState {
  const semana: SemanaState = {};
  for (const dia of DIAS) {
    semana[dia.valor] = {
      turno1: { activo: false, inicio: "08:00", fin: "12:00" },
      turno2: { activo: false, inicio: "14:00", fin: "16:30" },
    };
  }
  return semana;
}

function estadoDesdeHorarios(horarios: Horario[]): SemanaState {
  const semana = estadoVacio();
  for (const dia of DIAS) {
    const filas = horarios.filter((h) => h.diaSemana === dia.valor).sort((a, b) => a.horaInicio.localeCompare(b.horaInicio));
    if (filas[0]) semana[dia.valor].turno1 = { activo: true, inicio: filas[0].horaInicio, fin: filas[0].horaFin };
    if (filas[1]) semana[dia.valor].turno2 = { activo: true, inicio: filas[1].horaInicio, fin: filas[1].horaFin };
  }
  return semana;
}

function aInput(semana: SemanaState): BloqueHorarioInput[] {
  const resultado: BloqueHorarioInput[] = [];
  for (const dia of DIAS) {
    const { turno1, turno2 } = semana[dia.valor];
    if (turno1.activo) resultado.push({ diaSemana: dia.valor, horaInicio: turno1.inicio, horaFin: turno1.fin });
    if (turno2.activo) resultado.push({ diaSemana: dia.valor, horaInicio: turno2.inicio, horaFin: turno2.fin });
  }
  return resultado;
}

export function HorariosPage() {
  const { usuario } = useAuth();
  const esVeterinario = usuario?.rol === "VETERINARIO";
  const { data: veterinarios, isLoading: cargandoVeterinarios } = useVeterinarios();
  const { miVeterinario } = useMiVeterinario();
  const [veterinarioIdSeleccionado, setVeterinarioIdSeleccionado] = useState<number | undefined>();

  const veterinarioId = esVeterinario ? miVeterinario?.id : veterinarioIdSeleccionado;
  const veterinarioActual = esVeterinario ? miVeterinario : veterinarios?.find((v) => v.id === veterinarioId);

  const { data: horarios, isLoading: cargandoHorarios } = useHorarios(veterinarioId);
  const actualizarHorarios = useActualizarHorarios(veterinarioId);

  const [semana, setSemana] = useState<SemanaState>(estadoVacio());
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (horarios) setSemana(estadoDesdeHorarios(horarios));
  }, [horarios]);

  function actualizarTurno(dia: number, turno: "turno1" | "turno2", cambios: Partial<Turno>) {
    setSemana((prev) => ({ ...prev, [dia]: { ...prev[dia], [turno]: { ...prev[dia][turno], ...cambios } } }));
  }

  async function guardar() {
    setError(null);
    const input = aInput(semana);
    for (const bloque of input) {
      if (bloque.horaInicio >= bloque.horaFin) {
        setError("En cada turno activo, la hora de inicio debe ser anterior a la hora de fin");
        return;
      }
    }
    try {
      await actualizarHorarios.mutateAsync(input);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar el horario");
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Horarios</h1>
        <p className="text-muted-foreground">Horario semanal de atención por veterinario — define la disponibilidad real de Citas</p>
      </div>

      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <CardTitle className="text-base">Veterinario</CardTitle>
          {esVeterinario ? (
            <div className="flex h-9 items-center gap-2 rounded-md border bg-muted/40 px-3 text-sm">
              <ShieldCheck className="size-4 shrink-0 text-primary" />
              <span className="truncate">{miVeterinario ? `${miVeterinario.nombre} ${miVeterinario.apellidoPaterno}` : "Cargando…"}</span>
              <Badge variant="secondary" className="ml-auto shrink-0 text-[10px]">
                Tú
              </Badge>
            </div>
          ) : (
            <Select
              value={veterinarioIdSeleccionado ? String(veterinarioIdSeleccionado) : ""}
              onValueChange={(v) => setVeterinarioIdSeleccionado(Number(v))}
              disabled={cargandoVeterinarios}
            >
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Selecciona un veterinario" />
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
        </CardHeader>
      </Card>

      {!veterinarioId && !esVeterinario && (
        <p className="py-6 text-center text-sm text-muted-foreground">Selecciona un veterinario para ver y editar su horario.</p>
      )}

      {veterinarioId && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Semana {veterinarioActual ? `— ${veterinarioActual.nombre} ${veterinarioActual.apellidoPaterno}` : ""}
            </CardTitle>
            <p className="text-sm text-muted-foreground">Hasta 2 turnos por día (ej. mañana y tarde). Un día sin turnos activos queda sin atención.</p>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {cargandoHorarios ? (
              <div className="flex flex-col gap-2">
                {Array.from({ length: 7 }).map((_, i) => (
                  <Skeleton key={i} className="h-14 w-full" />
                ))}
              </div>
            ) : (
              <div className="flex flex-col divide-y">
                {DIAS.map((dia) => (
                  <div key={dia.valor} className="flex flex-col gap-3 py-3 sm:flex-row sm:items-center">
                    <span className="w-24 shrink-0 text-sm font-medium">{dia.etiqueta}</span>
                    <div className="flex flex-1 flex-wrap gap-4">
                      {(["turno1", "turno2"] as const).map((turnoKey) => {
                        const turno = semana[dia.valor][turnoKey];
                        return (
                          <div key={turnoKey} className="flex items-center gap-2">
                            <Switch
                              checked={turno.activo}
                              onCheckedChange={(activo) => actualizarTurno(dia.valor, turnoKey, { activo })}
                            />
                            <Input
                              type="time"
                              className="w-28"
                              value={turno.inicio}
                              disabled={!turno.activo}
                              onChange={(e) => actualizarTurno(dia.valor, turnoKey, { inicio: e.target.value })}
                            />
                            <span className="text-muted-foreground">–</span>
                            <Input
                              type="time"
                              className="w-28"
                              value={turno.fin}
                              disabled={!turno.activo}
                              onChange={(e) => actualizarTurno(dia.valor, turnoKey, { fin: e.target.value })}
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
              <Button onClick={guardar} disabled={actualizarHorarios.isPending || cargandoHorarios}>
                {actualizarHorarios.isPending && <Loader2 className="size-4 animate-spin" />}
                Guardar horario
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
