import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TableSkeleton } from "@/components/TableSkeleton";
import { usePreventiveHistory } from "@/features/preventive-controls/usePreventiveControls";
import type { Pet } from "@/features/pets/types";
import { cn } from "@/lib/utils";
import { useFormatters } from "@/lib/useFormatters";
import { ShieldPlus, Syringe } from "lucide-react";
import { useTranslation } from "react-i18next";
import { NewControlDialog } from "./NewControlDialog";

export function PreventiveHistory({ pet }: { pet: Pet }) {
  const { t } = useTranslation();
  const { formatDate } = useFormatters();
  const { data: controls, isLoading, isError } = usePreventiveHistory(pet.id);

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle className="text-base">
            {pet.name}{" "}
            <span className="font-normal text-muted-foreground">
              ({t(`enums.species.${pet.species}`, { defaultValue: pet.species })})
            </span>
          </CardTitle>
          <p className="text-sm text-muted-foreground">{t("preventive.historySubtitle")}</p>
        </div>
        <NewControlDialog pet={pet} />
      </CardHeader>
      <CardContent>
        {isLoading && (
<TableSkeleton rows={2} />
        )}

        {isError && <p className="py-6 text-center text-sm text-destructive">{t("visits.historyLoadError")}</p>}

        {!isLoading && !isError && controls?.length === 0 && (
          <div className="flex flex-col items-center gap-2 py-8 text-center text-muted-foreground">
            <ShieldPlus className="size-7" />
            <p>{t("preventive.historyEmpty")}</p>
          </div>
        )}

        {!isLoading && !isError && controls && controls.length > 0 && (
          <div className="flex flex-col divide-y">
            {controls.map((control) => (
              <div key={control.id} className="flex items-center gap-3 py-3">
                <Syringe className="size-4 shrink-0 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{t(`enums.controlType.${control.type}`)}</p>
                  <p className="text-xs text-muted-foreground">
                    {t("preventive.appliedOn", { date: formatDate(control.appliedOn) })} ·{" "}
                    {t("preventive.nextDoseOn", { date: formatDate(control.nextDoseOn) })}
                  </p>
                </div>
                {control.overdue && (
                  <Badge className={cn("border-none bg-red-100 font-medium text-red-700 dark:bg-red-500/15 dark:text-red-400")}>
                    {t("common.expired")}
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
