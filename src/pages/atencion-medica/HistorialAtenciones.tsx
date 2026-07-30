import { StatusBadge } from "@/components/StatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useHistorialAtenciones } from "@/features/atenciones/useAtenciones";
import type { Mascota } from "@/features/mascotas/types";
import { FileText } from "lucide-react";
import { NuevaAtencionDialog } from "./NuevaAtencionDialog";

function formatearFecha(iso: string) {
  const [fecha] = iso.split("T");
  const [yyyy, mm, dd] = fecha.split("-");
  return `${dd}/${mm}/${yyyy}`;
}

export function HistorialAtenciones({ mascota }: { mascota: Mascota }) {
  const { data: atenciones, isLoading, isError } = useHistorialAtenciones(mascota.id);

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle className="text-base">
            {mascota.nombre} <span className="font-normal text-muted-foreground">({mascota.especie} · {mascota.raza})</span>
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            {mascota.propietario.nombre} {mascota.propietario.apellidoPaterno}
          </p>
        </div>
        <NuevaAtencionDialog mascota={mascota} />
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className="flex flex-col gap-2">
            {Array.from({ length: 2 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        )}

        {isError && <p className="py-6 text-center text-sm text-destructive">No se pudo cargar el historial.</p>}

        {!isLoading && !isError && atenciones?.length === 0 && (
          <div className="flex flex-col items-center gap-2 py-8 text-center text-muted-foreground">
            <FileText className="size-7" />
            <p>Sin atenciones registradas todavía para esta mascota.</p>
          </div>
        )}

        {!isLoading && !isError && atenciones && atenciones.length > 0 && (
          <div className="flex flex-col divide-y">
            {atenciones.map((atencion) => (
              <div key={atencion.id} className="flex flex-col gap-1 py-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-medium">{formatearFecha(atencion.fecha)}</span>
                  <StatusBadge status={atencion.estadoPago} />
                </div>
                <p className="text-sm">
                  <span className="font-medium">Diagnóstico:</span> {atencion.diagnostico}
                </p>
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">Tratamiento:</span> {atencion.tratamiento}
                </p>
                <p className="text-xs text-muted-foreground">
                  {atencion.veterinario.nombre} {atencion.veterinario.apellidoPaterno} · Bs. {atencion.montoConsulta.toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
