import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useProximosAVencer } from "@/features/controles-preventivos/useControlesPreventivos";
import { CalendarClock, ShieldCheck } from "lucide-react";

const TIPO_LABEL = { VACUNA: "Vacuna", DESPARASITACION: "Desparasitación" } as const;

function formatearFecha(iso: string) {
  const [yyyy, mm, dd] = iso.split("-");
  return `${dd}/${mm}/${yyyy}`;
}

export function ProximosAVencerPanel() {
  const { data: controles, isLoading, isError } = useProximosAVencer(30);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Próximos a vencer (30 días)</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className="flex flex-col gap-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        )}

        {isError && <p className="py-4 text-center text-sm text-destructive">No se pudo cargar el listado.</p>}

        {!isLoading && !isError && controles?.length === 0 && (
          <div className="flex flex-col items-center gap-2 py-8 text-center text-muted-foreground">
            <ShieldCheck className="size-7" />
            <p>Nada próximo a vencer. Todo al día.</p>
          </div>
        )}

        {!isLoading && !isError && controles && controles.length > 0 && (
          <div className="flex flex-col divide-y">
            {controles.map((control) => (
              <div key={control.id} className="flex items-center gap-3 py-2.5">
                <CalendarClock className={control.vencido ? "size-4 shrink-0 text-red-500" : "size-4 shrink-0 text-amber-500"} />
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    {control.mascota.nombre} <span className="font-normal text-muted-foreground">({control.mascota.especie})</span>
                  </p>
                  <p className="text-xs text-muted-foreground">{TIPO_LABEL[control.tipo]}</p>
                </div>
                <span className={"text-xs font-medium " + (control.vencido ? "text-red-600 dark:text-red-400" : "text-amber-600 dark:text-amber-400")}>
                  {control.vencido ? "Vencido" : formatearFecha(control.proximaDosis)}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
