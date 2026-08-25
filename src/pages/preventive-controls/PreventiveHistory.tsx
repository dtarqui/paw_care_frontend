import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TableSkeleton } from "@/components/TableSkeleton";
import { usePreventiveHistory } from "@/features/preventive-controls/usePreventiveControls";
import type { Pet } from "@/features/pets/types";
import { cn } from "@/lib/utils";
import { ShieldPlus, Syringe } from "lucide-react";
import { NewControlDialog } from "./NewControlDialog";

const TIPO_LABEL = { VACCINE: "Vacuna", DEWORMING: "Desparasitación" } as const;

function formatearFecha(iso: string) {
  if (!iso) return "—";
  const [yyyy, mm, dd] = iso.split("-");
  return `${dd}/${mm}/${yyyy}`;
}

export function PreventiveHistory({ pet }: { pet: Pet }) {
  const { data: controls, isLoading, isError } = usePreventiveHistory(pet.id);

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle className="text-base">
            {pet.name} <span className="font-normal text-muted-foreground">({pet.species})</span>
          </CardTitle>
          <p className="text-sm text-muted-foreground">Historial de vacunación y desparasitación</p>
        </div>
        <NewControlDialog pet={pet} />
      </CardHeader>
      <CardContent>
        {isLoading && (
<TableSkeleton rows={2} />
        )}

        {isError && <p className="py-6 text-center text-sm text-destructive">No se pudo cargar el historial.</p>}

        {!isLoading && !isError && controls?.length === 0 && (
          <div className="flex flex-col items-center gap-2 py-8 text-center text-muted-foreground">
            <ShieldPlus className="size-7" />
            <p>Sin controles preventivos registrados todavía.</p>
          </div>
        )}

        {!isLoading && !isError && controls && controls.length > 0 && (
          <div className="flex flex-col divide-y">
            {controls.map((control) => (
              <div key={control.id} className="flex items-center gap-3 py-3">
                <Syringe className="size-4 shrink-0 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{TIPO_LABEL[control.type]}</p>
                  <p className="text-xs text-muted-foreground">
                    Aplicada: {formatearFecha(control.appliedOn)} · Próxima dosis: {formatearFecha(control.nextDoseOn)}
                  </p>
                </div>
                {control.overdue && (
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
