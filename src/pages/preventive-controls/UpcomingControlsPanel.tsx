import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TableSkeleton } from "@/components/TableSkeleton";
import { useUpcomingControls } from "@/features/preventive-controls/usePreventiveControls";
import { useFormatters } from "@/lib/useFormatters";
import { CalendarClock, ShieldCheck } from "lucide-react";
import { useTranslation } from "react-i18next";

export function UpcomingControlsPanel() {
  const { t } = useTranslation();
  const { formatDate } = useFormatters();
  const { data: controls, isLoading, isError } = useUpcomingControls(30);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{t("preventive.upcomingTitle")}</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading && (
<TableSkeleton rows={3} />
        )}

        {isError && <p className="py-4 text-center text-sm text-destructive">{t("preventive.upcomingLoadError")}</p>}

        {!isLoading && !isError && controls?.length === 0 && (
          <div className="flex flex-col items-center gap-2 py-8 text-center text-muted-foreground">
            <ShieldCheck className="size-7" />
            <p>{t("preventive.nothingDue")}</p>
          </div>
        )}

        {!isLoading && !isError && controls && controls.length > 0 && (
          <div className="flex flex-col divide-y">
            {controls.map((control) => (
              <div key={control.id} className="flex items-center gap-3 py-2.5">
                <CalendarClock className={control.overdue ? "size-4 shrink-0 text-red-500" : "size-4 shrink-0 text-amber-500"} />
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    {control.pet.name}{" "}
                    <span className="font-normal text-muted-foreground">
                      ({t(`enums.species.${control.pet.species}`, { defaultValue: control.pet.species })})
                    </span>
                  </p>
                  <p className="text-xs text-muted-foreground">{t(`enums.controlType.${control.type}`)}</p>
                </div>
                <span className={"text-xs font-medium " + (control.overdue ? "text-red-600 dark:text-red-400" : "text-amber-600 dark:text-amber-400")}>
                  {control.overdue ? t("common.expired") : formatDate(control.nextDoseOn)}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
