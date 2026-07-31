import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import type { EventoHistorialMascota } from "@/features/mascotas/types";
import { useCambiarEstadoMascota, useHistorialMascota, useMascota } from "@/features/mascotas/useMascotas";
import { calcularEdad } from "@/lib/mascota";
import { AlertTriangle, ArrowLeft, Loader2, PawPrint, Phone, User } from "lucide-react";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { EditarMascotaDialog } from "./EditarMascotaDialog";
import { GraficoPesoMascota, type PuntoPeso } from "./GraficoPesoMascota";
import { HistorialMascotaTimeline } from "./HistorialMascotaTimeline";

function formatearFecha(iso: string) {
  if (!iso) return "—";
  const [yyyy, mm, dd] = iso.split("-");
  return `${dd}/${mm}/${yyyy}`;
}

export function MascotaDetallePage() {
  const { id } = useParams<{ id: string }>();
  const mascotaId = Number(id);

  const { data: mascota, isLoading, isError } = useMascota(mascotaId);
  const { data: eventos, isLoading: cargandoHistorial } = useHistorialMascota(mascotaId);
  const cambiarEstado = useCambiarEstadoMascota(mascotaId);
  const [confirmando, setConfirmando] = useState(false);

  async function confirmarCambioEstado() {
    if (!mascota) return;
    await cambiarEstado.mutateAsync(mascota.estado === "ACTIVO" ? "INACTIVO" : "ACTIVO");
    setConfirmando(false);
  }

  function esAtencionConPeso(e: EventoHistorialMascota): e is Extract<EventoHistorialMascota, { tipo: "ATENCION" }> {
    return e.tipo === "ATENCION" && e.atencion.peso !== undefined;
  }

  const puntosPeso: PuntoPeso[] =
    eventos
      ?.filter(esAtencionConPeso)
      .map((e) => ({ fecha: e.atencion.fecha, peso: e.atencion.peso! }))
      .reverse() ?? []; // el historial viene descendente; el gráfico necesita orden ascendente

  return (
    <div className="flex flex-col gap-4">
      <Link to="/app/mascotas" className="flex w-fit items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" />
        Volver a Mascotas
      </Link>

      {isLoading && (
        <div className="flex flex-col gap-2">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      )}

      {isError && <p className="py-8 text-center text-sm text-destructive">No se pudo cargar esta mascota.</p>}

      {!isLoading && !isError && mascota && (
        <>
          {mascota.estado === "INACTIVO" && (
            <div className="flex items-center gap-3 rounded-lg border border-amber-300 bg-amber-50 p-4 text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-400">
              <AlertTriangle className="size-5 shrink-0" />
              <p className="text-sm">Esta mascota está inactiva — no aparece en el listado principal ni en los buscadores.</p>
            </div>
          )}

          <Card>
            <CardHeader className="flex-row items-start justify-between space-y-0">
              <div className="flex items-center gap-3">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <PawPrint className="size-6" />
                </div>
                <div>
                  <CardTitle className="text-xl">{mascota.nombre}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {mascota.especie}
                    {mascota.raza ? ` · ${mascota.raza}` : ""}
                    {mascota.sexo ? ` · ${mascota.sexo}` : ""}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <EditarMascotaDialog mascota={mascota} />
                <Button
                  variant={mascota.estado === "ACTIVO" ? "destructive" : "outline"}
                  onClick={() => setConfirmando(true)}
                >
                  {mascota.estado === "ACTIVO" ? "Eliminar mascota" : "Reactivar"}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div>
                  <p className="text-xs text-muted-foreground">Fecha de nacimiento</p>
                  <p className="text-sm font-medium">{formatearFecha(mascota.fechaNacimiento)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Edad</p>
                  <p className="text-sm font-medium">{calcularEdad(mascota.fechaNacimiento) ?? "—"}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Peso actual</p>
                  <p className="text-sm font-medium">{mascota.peso ? `${mascota.peso} kg` : "—"}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Sexo</p>
                  <p className="text-sm font-medium">{mascota.sexo || "—"}</p>
                </div>
              </div>

              <Separator />

              <div className="flex flex-wrap items-center gap-4">
                <Badge variant="secondary" className="gap-1.5 border-none font-normal">
                  <User className="size-3.5" />
                  {mascota.propietario.nombre} {mascota.propietario.apellidoPaterno} · CI {mascota.propietario.ci}
                </Badge>
                {mascota.propietario.telefono && (
                  <Badge variant="secondary" className="gap-1.5 border-none font-normal">
                    <Phone className="size-3.5" />
                    {mascota.propietario.telefono}
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>

          {puntosPeso.length >= 2 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Evolución de peso</CardTitle>
              </CardHeader>
              <CardContent>
                <GraficoPesoMascota puntos={puntosPeso} />
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Historial</CardTitle>
              <p className="text-sm text-muted-foreground">Atenciones, citas, controles preventivos y ediciones, en orden cronológico</p>
            </CardHeader>
            <CardContent>
              {cargandoHistorial && (
                <div className="flex flex-col gap-2">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              )}
              {!cargandoHistorial && <HistorialMascotaTimeline eventos={eventos ?? []} />}
            </CardContent>
          </Card>
        </>
      )}

      {mascota && (
        <Dialog open={confirmando} onOpenChange={setConfirmando}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>{mascota.estado === "ACTIVO" ? "¿Eliminar mascota?" : "¿Reactivar mascota?"}</DialogTitle>
            </DialogHeader>
            <p className="text-sm text-muted-foreground">
              {mascota.estado === "ACTIVO"
                ? `${mascota.nombre} dejará de aparecer en el listado y en los buscadores. Su historial clínico no se borra y se puede reactivar en cualquier momento desde esta misma página.`
                : `${mascota.nombre} volverá a aparecer en el listado principal y en los buscadores.`}
            </p>
            <DialogFooter>
              <Button variant="outline" onClick={() => setConfirmando(false)}>
                Cancelar
              </Button>
              <Button
                variant={mascota.estado === "ACTIVO" ? "destructive" : "default"}
                onClick={confirmarCambioEstado}
                disabled={cambiarEstado.isPending}
              >
                {cambiarEstado.isPending && <Loader2 className="size-4 animate-spin" />}
                {mascota.estado === "ACTIVO" ? "Eliminar" : "Reactivar"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
