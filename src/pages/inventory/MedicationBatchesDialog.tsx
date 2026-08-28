import { TableSkeleton } from "@/components/TableSkeleton";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { Medication } from "@/features/medications/types";
import { useMedicationBatches } from "@/features/medications/useMedications";
import { useFormatters } from "@/lib/useFormatters";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

/**
 * Los lotes de un medicamento. Incluye los agotados a propósito: son la historia de
 * lo que entró y cuándo, y es lo que se mira cuando hay que rastrear de qué lote
 * salió lo que se aplicó.
 */
export function MedicationBatchesDialog({
  medication,
  onClose,
}: {
  medication: Medication | null;
  onClose: () => void;
}) {
  const { t } = useTranslation();
  const { formatDate } = useFormatters();
  const { data: batches, isLoading } = useMedicationBatches(medication?.id);

  return (
    <Dialog open={!!medication} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{t("inventory.batchesOf", { name: medication?.name ?? "" })}</DialogTitle>
        </DialogHeader>

        {isLoading && <TableSkeleton rows={3} />}

        {!isLoading && batches?.length === 0 && (
          <p className="py-6 text-center text-sm text-muted-foreground">{t("inventory.noBatches")}</p>
        )}

        {!isLoading && batches && batches.length > 0 && (
          <div className="flex max-h-[60vh] flex-col divide-y overflow-y-auto">
            {batches.map((batch) => (
              <div key={batch.id} className="flex items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium">
                    {batch.batchNumber ?? t("inventory.noBatchNumber")}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {batch.expiresOn
                      ? t("inventory.expiresOnDate", { date: formatDate(batch.expiresOn) })
                      : t("inventory.noExpiry")}
                    {" · "}
                    {t("inventory.receivedOnDate", { date: formatDate(batch.receivedOn) })}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  {batch.expired && (
                    <Badge className="border-none bg-red-100 font-medium text-red-700 dark:bg-red-500/15 dark:text-red-400">
                      {t("inventory.expired")}
                    </Badge>
                  )}
                  <span
                    className={cn(
                      "tabular-nums text-sm font-medium",
                      batch.quantity === 0 && "text-muted-foreground line-through"
                    )}
                  >
                    {t("inventory.unitsCount", { count: batch.quantity })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
