import { StatusBadge } from "@/components/StatusBadge";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useHistorialAtenciones } from "@/features/atenciones/useAtenciones";
import type { Mascota } from "@/features/mascotas/types";
import { calcularEdad } from "@/lib/mascota";
import { FilePlus2, User } from "lucide-react";
import { NuevaAtencionDialog } from "./NuevaAtencionDialog";

function formatearFecha(iso: string) {
  const [fecha] = iso.split("T");
  const [yyyy, mm, dd] = fecha.split("-");
  return `${dd}/${mm}/${yyyy}`;
}

export function HistorialAtenciones({ mascota }: { mascota: Mascota }) {
  const { data: atenciones, isLoading, isError } = useHistorialAtenciones(mascota.id);
  const edad = calcularEdad(mascota.fechaNacimiento);

  return (
    <Card>
      <CardHeader className="flex-row items-start justify-between space-y-0">
        <div className="flex flex-col gap-2">
          <div>
            <CardTitle className="text-base">
              {mascota.nombre} <span className="font-normal text-muted-foreground">({mascota.especie} · {mascota.raza})</span>
            </CardTitle>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <User className="size-3.5" />
              {mascota.propietario.nombre} {mascota.propietario.apellidoPaterno}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            {mascota.sexo && (
              <Badge variant="secondary" className="border-none font-normal">
                {mascota.sexo}
              </Badge>
            )}
            {edad && (
              <Badge variant="secondary" className="border-none font-normal">
                {edad}
              </Badge>
            )}
            {mascota.peso && (
              <Badge variant="secondary" className="border-none font-normal">
                {mascota.peso} kg
              </Badge>
            )}
          </div>
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
          <div className="flex flex-col items-center gap-2 py-10 text-center text-muted-foreground">
            <FilePlus2 className="size-8" />
            <p className="font-medium text-foreground">Aún no hay atenciones registradas para {mascota.nombre}</p>
            <p className="text-sm">Usa el botón "Nueva atención" arriba para registrar la primera.</p>
          </div>
        )}

        {!isLoading && !isError && atenciones && atenciones.length > 0 && (
          <div className="flex flex-col divide-y">
            {atenciones.map((atencion) => (
              <div key={atencion.id} className="flex flex-col gap-1 py-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-medium">
                    {formatearFecha(atencion.fecha)} <span className="font-normal text-muted-foreground">· {atencion.tipoServicio}</span>
                  </span>
                  <StatusBadge status={atencion.estadoPago} />
                </div>
                <p className="text-sm">
                  <span className="font-medium">Diagnóstico:</span> {atencion.diagnostico}
                </p>
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">Tratamiento:</span> {atencion.tratamiento}
                </p>
                {atencion.examenesExternos && (
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">Exámenes externos:</span> {atencion.examenesExternos}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  {atencion.veterinario.nombre} {atencion.veterinario.apellidoPaterno} · Bs. {atencion.montoConsulta.toFixed(2)}
                  {atencion.peso !== undefined && <> · Peso registrado: {atencion.peso} kg</>}
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
