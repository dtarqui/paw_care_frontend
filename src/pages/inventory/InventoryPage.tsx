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
import { useDeleteMedication, useMedications, useLowStockMedications } from "@/features/medications/useMedications";
import { AlertTriangle, Loader2, Package } from "lucide-react";
import { useState } from "react";
import { EditMedicationDialog } from "./EditMedicationDialog";
import { NewMedicationDialog } from "./NewMedicationDialog";
import { RegisterStockInDialog } from "./RegisterStockInDialog";

export function InventoryPage() {
  const { data: medications, isLoading, isError } = useMedications();
  const { data: lowStock } = useLowStockMedications();
  const [selected, setSelected] = useState<Medication | null>(null);
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
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Inventario</h1>
          <p className="text-muted-foreground">Catálogo y stock de medicamentos</p>
        </div>
        <NewMedicationDialog />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <StatTile label="Medicamentos en catálogo" value={medications?.length ?? 0} icon={Package} isLoading={isLoading} />
        <StatTile
          label="Bajo el mínimo"
          value={lowStock?.length ?? 0}
          icon={AlertTriangle}
          isLoading={isLoading}
          tone={lowStock && lowStock.length > 0 ? "warning" : "default"}
        />
      </div>

      {lowStock && lowStock.length > 0 && (
        <div className="flex items-start gap-3 rounded-lg border border-amber-300 bg-amber-50 p-4 text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-400">
          <AlertTriangle className="mt-0.5 size-5 shrink-0" />
          <p className="text-sm">
            <span className="font-medium">{lowStock.length} medicamento(s) con stock bajo:</span>{" "}
            {lowStock.map((m) => m.name).join(", ")}.
          </p>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Medicamentos</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading && <TableSkeleton rows={4} />}


          {isError && <ErrorState message="No se pudo cargar el inventario." />}

          {!isLoading && !isError && medications?.length === 0 && (
            <EmptyState
              icon={Package}
              title="Sin medicamentos registrados todavía"
              description="Cargá el catálogo para poder descontar stock al registrar atenciones."
              action={<NewMedicationDialog />}
            />
          )}

          {!isLoading && !isError && medications && medications.length > 0 && (
            <>
              <MobileCardList>
                {medications.map((medication) => {
                  const low = medication.currentStock <= medication.minimumStock;
                  return (
                    <MobileCard
                      key={medication.id}
                      title={medication.name}
                      badge={
                        low ? (
                          <Badge className="border-none bg-amber-100 font-medium text-amber-700 dark:bg-amber-500/15 dark:text-amber-400">
                            Bajo stock
                          </Badge>
                        ) : (
                          <Badge className="border-none bg-emerald-100 font-medium text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400">
                            Suficiente
                          </Badge>
                        )
                      }
                      rows={[
                        { label: "Stock actual", value: <span className="tabular-nums">{medication.currentStock}</span> },
                        { label: "Stock mínimo", value: <span className="tabular-nums">{medication.minimumStock}</span> },
                      ]}
                      actions={
                        <>
                          <Button size="sm" variant="outline" className="flex-1" onClick={() => setSelected(medication)}>
                            Registrar entrada
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => setEditing(medication)}>
                            Editar
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => setDeleting(medication)}>
                            Eliminar
                          </Button>
                        </>
                      }
                    />
                  );
                })}
              </MobileCardList>

              <DesktopTable>
                <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Medicamento</TableHead>
                    <TableHead>Stock actual</TableHead>
                    <TableHead>Stock mínimo</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acción</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {medications.map((medication) => {
                    const isLow = medication.currentStock <= medication.minimumStock;
                    return (
                      <TableRow key={medication.id}>
                        <TableCell className="font-medium">{medication.name}</TableCell>
                        <TableCell className="tabular-nums">{medication.currentStock}</TableCell>
                        <TableCell className="tabular-nums">{medication.minimumStock}</TableCell>
                        <TableCell>
                          {isLow ? (
                            <Badge className="border-none bg-amber-100 font-medium text-amber-700 dark:bg-amber-500/15 dark:text-amber-400">
                              Bajo stock
                            </Badge>
                          ) : (
                            <Badge className="border-none bg-emerald-100 font-medium text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400">
                              Suficiente
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button size="sm" variant="outline" onClick={() => setSelected(medication)}>
                            Registrar entrada
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => setEditing(medication)}>
                            Editar
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => setDeleting(medication)}>
                            Eliminar
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
                </Table>
              </DesktopTable>
            </>
          )}
        </CardContent>
      </Card>

      <RegisterStockInDialog medication={selected} onClose={() => setSelected(null)} />
      <EditMedicationDialog medication={editing} onClose={() => setEditing(null)} />

      <Dialog open={!!deleting} onOpenChange={(v) => !v && setDeleting(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>¿Eliminar medicamento?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Se eliminará «{deleting?.name}» del catálogo. Si ya tiene movimientos de inventario registrados (entradas o
            consumos en atenciones), no se podrá eliminar.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleting(null)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={deleteMedicationMutation.isPending}>
              {deleteMedicationMutation.isPending && <Loader2 className="size-4 animate-spin" />}
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
