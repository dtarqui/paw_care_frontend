import { EmptyState, ErrorState } from "@/components/EmptyState";
import { DesktopTable, MobileCard, MobileCardList } from "@/components/MobileCard";
import { StatTile } from "@/components/StatTile";
import { TableSkeleton } from "@/components/TableSkeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Medication } from "@/features/medications/types";
import {
  useDeleteMedication,
  useExpiringBatches,
  useLowStockMedications,
  useMedications,
} from "@/features/medications/useMedications";
import { useFormatters } from "@/lib/useFormatters";
import { AlertTriangle, CalendarX2, Loader2, Package } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { EditMedicationDialog } from "./EditMedicationDialog";
import { MedicationBatchesDialog } from "./MedicationBatchesDialog";
import { NewMedicationDialog } from "./NewMedicationDialog";
import { RegisterStockInDialog } from "./RegisterStockInDialog";

export function InventoryPage() {
  const { t } = useTranslation();
  const { data: medications, isLoading, isError } = useMedications();
  const { data: lowStock } = useLowStockMedications();
  const { data: expiring } = useExpiringBatches();
  const { formatDate } = useFormatters();
  const [selected, setSelected] = useState<Medication | null>(null);
  const [showingBatches, setShowingBatches] = useState<Medication | null>(null);
  const [editing, setEditing] = useState<Medication | null>(null);
  const [deleting, setDeleting] = useState<Medication | null>(null);
  const deleteMedicationMutation = useDeleteMedication();

  async function confirmDelete() {
    if (!deleting) return;
    try {
      await deleteMedicationMutation.mutateAsync(deleting.id);
      setDeleting(null);
    } catch {
      // el toast de error ya lo maneja el hook — se deja el modal abierto para reintentar/cancelar
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{t("inventory.title")}</h1>
          <p className="text-muted-foreground">{t("inventory.subtitle")}</p>
        </div>
        <NewMedicationDialog />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <StatTile label={t("inventory.catalogueCount")} value={medications?.length ?? 0} icon={Package} isLoading={isLoading} />
        <StatTile
          label={t("inventory.belowMinimum")}
          value={lowStock?.length ?? 0}
          icon={AlertTriangle}
          isLoading={isLoading}
          tone={lowStock && lowStock.length > 0 ? "warning" : "default"}
        />
        <StatTile
          label={t("inventory.expiringCount")}
          value={expiring?.length ?? 0}
          icon={CalendarX2}
          isLoading={isLoading}
          tone={expiring && expiring.length > 0 ? "warning" : "default"}
        />
      </div>

      {lowStock && lowStock.length > 0 && (
        <div className="flex items-start gap-3 rounded-lg border border-amber-300 bg-amber-50 p-4 text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-400">
          <AlertTriangle className="mt-0.5 size-5 shrink-0" />
          <p className="text-sm">
            <span className="font-medium">{t("inventory.lowStockWarning", { count: lowStock.length })}</span>{" "}
            {lowStock.map((m) => m.name).join(", ")}.
          </p>
        </div>
      )}

      {/* Lo vencido primero y en rojo: no es "conviene reponer", es "sacá eso del
          estante". Lo que está por vencer va debajo, en ámbar. */}
      {expiring && expiring.length > 0 && (
        <div className="flex flex-col gap-2">
          {expiring
            .filter((batch) => batch.expired)
            .map((batch) => (
              <div
                key={batch.id}
                className="flex items-start gap-3 rounded-lg border border-red-300 bg-red-50 p-4 text-red-800 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-400"
              >
                <CalendarX2 className="mt-0.5 size-5 shrink-0" />
                <p className="text-sm">
                  <span className="font-medium">{t("inventory.expiredAlert", { name: batch.medicationName })}</span>{" "}
                  {t("inventory.expiredAlertDetail", {
                    count: batch.quantity,
                    batch: batch.batchNumber ?? t("inventory.noBatchNumber"),
                    date: formatDate(batch.expiresOn!),
                  })}
                </p>
              </div>
            ))}
          {expiring.some((batch) => !batch.expired) && (
            <div className="flex items-start gap-3 rounded-lg border border-amber-300 bg-amber-50 p-4 text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-400">
              <CalendarX2 className="mt-0.5 size-5 shrink-0" />
              <p className="text-sm">
                <span className="font-medium">
                  {t("inventory.expiringSoon", { count: expiring.filter((b) => !b.expired).length })}
                </span>{" "}
                {expiring
                  .filter((batch) => !batch.expired)
                  .map((batch) => `${batch.medicationName} (${formatDate(batch.expiresOn!)})`)
                  .join(", ")}
                .
              </p>
            </div>
          )}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t("inventory.medications")}</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading && <TableSkeleton rows={4} />}


          {isError && <ErrorState message={t("inventory.loadError")} />}

          {!isLoading && !isError && medications?.length === 0 && (
            <EmptyState
              icon={Package}
              title={t("inventory.emptyTitle")}
              description={t("inventory.emptyDescription")}
              action={<NewMedicationDialog />}
            />
          )}

          {!isLoading && !isError && medications && medications.length > 0 && (
            <>
              <MobileCardList>
                {medications.map((medication) => (
                    <MobileCard
                      key={medication.id}
                      title={medication.name}
                      badge={<StockBadge medication={medication} />}
                      rows={[
                        {
                          label: t("inventory.availableStock"),
                          value: (
                            <StockCell
                              medication={medication}
                              onShowBatches={() => setShowingBatches(medication)}
                            />
                          ),
                        },
                        {
                          label: t("inventory.minimumStock"),
                          value: <span className="tabular-nums">{medication.minimumStock}</span>,
                        },
                        {
                          label: t("inventory.nextExpiry"),
                          value: (
                            <span className="tabular-nums">
                              {medication.nextExpiryOn ? formatDate(medication.nextExpiryOn) : "—"}
                            </span>
                          ),
                        },
                      ]}
                      actions={
                        <>
                          <Button size="sm" variant="outline" className="flex-1" onClick={() => setSelected(medication)}>
                            {t("inventory.registerStockIn")}
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => setEditing(medication)}>
                            {t("common.edit")}
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => setDeleting(medication)}>
                            {t("common.delete")}
                          </Button>
                        </>
                      }
                    />
                ))}
              </MobileCardList>

              <DesktopTable>
                <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("inventory.medication")}</TableHead>
                    <TableHead>{t("inventory.availableStock")}</TableHead>
                    <TableHead>{t("inventory.nextExpiry")}</TableHead>
                    <TableHead>{t("common.status")}</TableHead>
                    <TableHead className="text-right">{t("common.action")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {medications.map((medication) => (
                      <TableRow key={medication.id}>
                        <TableCell className="font-medium">{medication.name}</TableCell>
                        <TableCell>
                          <StockCell
                            medication={medication}
                            onShowBatches={() => setShowingBatches(medication)}
                            showMinimum
                          />
                        </TableCell>
                        <TableCell className="tabular-nums">
                          {medication.nextExpiryOn ? formatDate(medication.nextExpiryOn) : "—"}
                        </TableCell>
                        <TableCell>
                          <StockBadge medication={medication} />
                        </TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button size="sm" variant="outline" onClick={() => setSelected(medication)}>
                            {t("inventory.registerStockIn")}
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => setEditing(medication)}>
                            {t("common.edit")}
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => setDeleting(medication)}>
                            {t("common.delete")}
                          </Button>
                        </TableCell>
                      </TableRow>
                  ))}
                </TableBody>
                </Table>
              </DesktopTable>
            </>
          )}
        </CardContent>
      </Card>

      <RegisterStockInDialog medication={selected} onClose={() => setSelected(null)} />
      <MedicationBatchesDialog medication={showingBatches} onClose={() => setShowingBatches(null)} />
      <EditMedicationDialog medication={editing} onClose={() => setEditing(null)} />

      <Dialog open={!!deleting} onOpenChange={(v) => !v && setDeleting(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>{t("inventory.confirmDeleteTitle")}</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            {t("inventory.confirmDeleteBody", { name: deleting?.name ?? "" })}
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleting(null)}>
              {t("common.cancel")}
            </Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={deleteMedicationMutation.isPending}>
              {deleteMedicationMutation.isPending && <Loader2 className="size-4 animate-spin" />}
              {t("common.delete")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/**
 * El stock que importa es el utilizable. El total del estante se muestra solo cuando
 * difiere —es decir, cuando hay unidades vencidas— porque si no es un número repetido
 * que no aporta nada.
 */
function StockCell({
  medication,
  onShowBatches,
  showMinimum,
}: {
  medication: Medication;
  onShowBatches?: () => void;
  /** Solo en la tabla: ahí el mínimo perdió su columna. La tarjeta ya lo lista aparte. */
  showMinimum?: boolean;
}) {
  const { t } = useTranslation();
  const content = (
    <>
      {medication.availableStock}
      {medication.expiredStock > 0 && (
        <span className="ml-1.5 text-xs font-normal text-red-700 dark:text-red-400">
          {t("inventory.plusExpired", { count: medication.expiredStock })}
        </span>
      )}
    </>
  );

  if (!onShowBatches) return <span className="tabular-nums">{content}</span>;
  return (
    <div className="flex flex-col">
      <button
        type="button"
        onClick={onShowBatches}
        title={t("inventory.batches")}
        className="w-fit tabular-nums underline decoration-dotted underline-offset-4 transition-colors hover:text-primary"
      >
        {content}
      </button>
      {showMinimum && (
        <span className="text-xs text-muted-foreground tabular-nums">
          {t("inventory.minimumShort", { count: medication.minimumStock })}
        </span>
      )}
    </div>
  );
}

/** Vencido y stock bajo son problemas distintos y pueden pasar a la vez: uno se
 * resuelve retirando del estante y el otro comprando. */
function StockBadge({ medication }: { medication: Medication }) {
  const { t } = useTranslation();
  const low = medication.availableStock <= medication.minimumStock;
  return (
    <span className="flex flex-wrap gap-1">
      {medication.expiredStock > 0 && (
        <Badge className="border-none bg-red-100 font-medium text-red-700 dark:bg-red-500/15 dark:text-red-400">
          {t("inventory.expired")}
        </Badge>
      )}
      {low ? (
        <Badge className="border-none bg-amber-100 font-medium text-amber-700 dark:bg-amber-500/15 dark:text-amber-400">
          {t("inventory.lowStock")}
        </Badge>
      ) : (
        medication.expiredStock === 0 && (
          <Badge className="border-none bg-emerald-100 font-medium text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400">
            {t("inventory.enoughStock")}
          </Badge>
        )
      )}
    </span>
  );
}
