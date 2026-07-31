import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useHistorialRecordatorios,
  useMarcarRecordatorioEnviado,
  useRecordatoriosPendientes,
} from "@/features/recordatorios/useRecordatorios";
import { CalendarClock, CheckCheck, MessageCircle, ShieldPlus } from "lucide-react";

function numeroWhatsApp(telefono: string): string {
  const limpio = telefono.replace(/\D/g, "");
  return limpio.startsWith("591") ? limpio : `591${limpio}`;
}

function enlaceWhatsApp(telefono: string, mensaje: string): string {
  return `https://wa.me/${numeroWhatsApp(telefono)}?text=${encodeURIComponent(mensaje)}`;
}

function formatearFechaHora(iso: string) {
  if (!iso) return "—";
  const [fecha, hora] = iso.split("T");
  const [yyyy, mm, dd] = fecha.split("-");
  return `${dd}/${mm}/${yyyy} ${hora ? hora.slice(0, 5) : ""}`.trim();
}

export function RecordatoriosPage() {
  const { data: recordatorios, isLoading, isError } = useRecordatoriosPendientes();
  const { data: enviados, isLoading: cargandoEnviados } = useHistorialRecordatorios(5);
  const marcarEnviado = useMarcarRecordatorioEnviado();

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Recordatorios</h1>
        <p className="text-muted-foreground">
          Citas en las próximas 24h y controles preventivos a 7 días — envío manual por WhatsApp, sin costo ni integración externa.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Pendientes de hoy</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading && (
            <div className="flex flex-col gap-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          )}

          {isError && <p className="py-8 text-center text-sm text-destructive">No se pudo cargar la lista.</p>}

          {!isLoading && !isError && recordatorios?.length === 0 && (
            <div className="flex flex-col items-center gap-2 py-12 text-center text-muted-foreground">
              <MessageCircle className="size-8" />
              <p>No hay recordatorios pendientes por ahora.</p>
            </div>
          )}

          {!isLoading && !isError && recordatorios && recordatorios.length > 0 && (
            <div className="flex flex-col divide-y">
              {recordatorios.map((recordatorio) => {
                const Icono = recordatorio.tipo === "CITA" ? CalendarClock : ShieldPlus;
                return (
                  <div key={recordatorio.id} className="flex flex-wrap items-center gap-3 py-3">
                    <Icono className="size-5 shrink-0 text-muted-foreground" />
                    <div className="min-w-[220px] flex-1">
                      <p className="text-sm font-medium">{recordatorio.referencia}</p>
                      <p className="text-xs text-muted-foreground">
                        {recordatorio.propietario.nombre} {recordatorio.propietario.apellidoPaterno} · {recordatorio.propietario.telefono}
                      </p>
                    </div>
                    <Button asChild size="sm">
                      <a
                        href={enlaceWhatsApp(recordatorio.propietario.telefono, recordatorio.mensaje)}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <MessageCircle className="size-4" />
                        Enviar por WhatsApp
                      </a>
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={marcarEnviado.isPending}
                      onClick={() => marcarEnviado.mutate(recordatorio.id)}
                    >
                      Marcar como enviado
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Últimos enviados</CardTitle>
        </CardHeader>
        <CardContent>
          {cargandoEnviados && (
            <div className="flex flex-col gap-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-14 w-full" />
              ))}
            </div>
          )}

          {!cargandoEnviados && enviados?.length === 0 && (
            <div className="flex flex-col items-center gap-2 py-8 text-center text-muted-foreground">
              <CheckCheck className="size-7" />
              <p>Todavía no se marcó ningún recordatorio como enviado.</p>
            </div>
          )}

          {!cargandoEnviados && enviados && enviados.length > 0 && (
            <div className="flex flex-col divide-y">
              {enviados.map((enviado) => (
                <div key={enviado.id} className="flex flex-wrap items-start justify-between gap-3 py-3">
                  <div className="min-w-[220px] flex-1">
                    <p className="text-sm font-medium">
                      {enviado.propietario.nombre} {enviado.propietario.apellidoPaterno}
                    </p>
                    <p className="text-xs text-muted-foreground">{enviado.mensaje}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <Badge variant="secondary" className="border-none font-normal">
                      WhatsApp
                    </Badge>
                    <span className="text-xs text-muted-foreground">{formatearFechaHora(enviado.enviadoEn)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
