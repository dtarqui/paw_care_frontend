import { StatusBadge } from "@/components/StatusBadge";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { EventoHistorialMascota } from "@/features/mascotas/types";
import { CalendarDays, History, PenLine, Stethoscope, Syringe } from "lucide-react";
import type { ReactNode } from "react";

const TIPO_CONTROL_LABEL = { VACUNA: "Vacuna", DESPARASITACION: "Desparasitación" } as const;

function formatearFechaHora(literal: string) {
  const [fecha, hora] = literal.split("T");
  const [yyyy, mm, dd] = fecha.split("-");
  return hora ? `${dd}/${mm}/${yyyy} · ${hora}` : `${dd}/${mm}/${yyyy}`;
}

function formatearFecha(iso: string) {
  if (!iso) return "—";
  const [yyyy, mm, dd] = iso.split("-");
  return `${dd}/${mm}/${yyyy}`;
}

function Fila({ icono, titulo, detalle, meta, badge }: { icono: ReactNode; titulo: ReactNode; detalle?: ReactNode; meta: string; badge?: ReactNode }) {
  return (
    <div className="flex items-start gap-3 py-3">
      <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
        {icono}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-medium">{titulo}</p>
          {badge}
        </div>
        {detalle && <p className="text-sm text-muted-foreground">{detalle}</p>}
        <p className="text-xs text-muted-foreground">{meta}</p>
      </div>
    </div>
  );
}

function EventoRow({ evento }: { evento: EventoHistorialMascota }) {
  if (evento.tipo === "ATENCION") {
    const { atencion } = evento;
    return (
      <Fila
        icono={<Stethoscope className="size-4" />}
        titulo={atencion.tipoServicio}
        detalle={
          <>
            <span className="font-medium text-foreground">Diagnóstico:</span> {atencion.diagnostico}
            {atencion.peso ? ` · Peso: ${atencion.peso} kg` : ""}
          </>
        }
        meta={`${formatearFechaHora(atencion.fecha)} · ${atencion.veterinario.nombre} ${atencion.veterinario.apellidoPaterno} · Bs. ${atencion.montoConsulta.toFixed(2)}`}
        badge={<StatusBadge status={atencion.estadoPago} />}
      />
    );
  }

  if (evento.tipo === "CONTROL") {
    const { control } = evento;
    return (
      <Fila
        icono={<Syringe className="size-4" />}
        titulo={TIPO_CONTROL_LABEL[control.tipo]}
        detalle={`Próxima dosis: ${formatearFecha(control.proximaDosis)}`}
        meta={`Aplicada: ${formatearFecha(control.fechaAplicacion)}`}
        badge={
          control.vencido ? (
            <Badge className={cn("border-none bg-red-100 font-medium text-red-700 dark:bg-red-500/15 dark:text-red-400")}>
              Vencido
            </Badge>
          ) : undefined
        }
      />
    );
  }

  if (evento.tipo === "CITA") {
    const { cita } = evento;
    return (
      <Fila
        icono={<CalendarDays className="size-4" />}
        titulo={`${cita.tipoConsulta}${cita.motivo ? ` — ${cita.motivo}` : ""}`}
        meta={`${formatearFechaHora(cita.fechaHora)} · ${cita.veterinario.nombre} ${cita.veterinario.apellidoPaterno}`}
        badge={<StatusBadge status={cita.estado} />}
      />
    );
  }

  const { cambio } = evento;
  return (
    <Fila
      icono={<PenLine className="size-4" />}
      titulo={`Se editó "${cambio.campo}"`}
      detalle={`${cambio.valorAnterior || "—"} → ${cambio.valorNuevo || "—"}`}
      meta={`${formatearFechaHora(cambio.fecha)}${cambio.usuario ? ` · ${cambio.usuario}` : ""}`}
    />
  );
}

export function HistorialMascotaTimeline({ eventos }: { eventos: EventoHistorialMascota[] }) {
  if (eventos.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-10 text-center text-muted-foreground">
        <History className="size-7" />
        <p>Sin actividad registrada todavía para esta mascota.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col divide-y">
      {eventos.map((evento, i) => (
        // eslint-disable-next-line react/no-array-index-key
        <EventoRow key={`${evento.tipo}-${i}`} evento={evento} />
      ))}
    </div>
  );
}
