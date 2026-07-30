import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useHistorialPreventivo } from "@/features/controles-preventivos/useControlesPreventivos";
import type { Mascota } from "@/features/mascotas/types";
import { cn } from "@/lib/utils";
import { ShieldPlus, Syringe } from "lucide-react";
import { NuevoControlDialog } from "./NuevoControlDialog";

const TIPO_LABEL = { VACUNA: "Vacuna", DESPARASITACION: "Desparasitación" } as const;

function formatearFecha(iso: string) {
  if (!iso) return "—";
  const [yyyy, mm, dd] = iso.split("-");
  return `${dd}/${mm}/${yyyy}`;
}

export function HistorialPreventivo({ mascota }: { mascota: Mascota }) {
  const { data: controles, isLoading, isError } = useHistorialPreventivo(mascota.id);

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle className="text-base">
            {mascota.nombre} <span className="font-normal text-muted-foreground">({mascota.especie})</span>
          </CardTitle>
          <p className="text-sm text-muted-foreground">Historial de vacunación y desparasitación</p>
        </div>
        <NuevoControlDialog mascota={mascota} />
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className="flex flex-col gap-2">
            {Array.from({ length: 2 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        )}

        {isError && <p className="py-6 text-center text-sm text-destructive">No se pudo cargar el historial.</p>}

        {!isLoading && !isError && controles?.length === 0 && (
          <div className="flex flex-col items-center gap-2 py-8 text-center text-muted-foreground">
            <ShieldPlus className="size-7" />
            <p>Sin controles preventivos registrados todavía.</p>
          </div>
        )}

        {!isLoading && !isError && controles && controles.length > 0 && (
          <div className="flex flex-col divide-y">
            {controles.map((control) => (
              <div key={control.id} className="flex items-center gap-3 py-3">
                <Syringe className="size-4 shrink-0 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{TIPO_LABEL[control.tipo]}</p>
                  <p className="text-xs text-muted-foreground">
                    Aplicada: {formatearFecha(control.fechaAplicacion)} · Próxima dosis: {formatearFecha(control.proximaDosis)}
                  </p>
                </div>
                {control.vencido && (
                  <Badge className={cn("border-none bg-red-100 font-medium text-red-700 dark:bg-red-500/15 dark:text-red-400")}>
                    Vencido
                  </Badge>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
