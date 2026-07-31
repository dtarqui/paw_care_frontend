import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Medicamento } from "@/features/medicamentos/types";
import { useEliminarMedicamento, useMedicamentos, useMedicamentosBajoStock } from "@/features/medicamentos/useMedicamentos";
import { AlertTriangle, Loader2, Package } from "lucide-react";
import { useState } from "react";
import { EditarMedicamentoDialog } from "./EditarMedicamentoDialog";
import { NuevoMedicamentoDialog } from "./NuevoMedicamentoDialog";
import { RegistrarEntradaDialog } from "./RegistrarEntradaDialog";

export function InventarioPage() {
  const { data: medicamentos, isLoading, isError } = useMedicamentos();
  const { data: bajoStock } = useMedicamentosBajoStock();
  const [seleccionado, setSeleccionado] = useState<Medicamento | null>(null);
  const [editando, setEditando] = useState<Medicamento | null>(null);
  const [eliminando, setEliminando] = useState<Medicamento | null>(null);
  const eliminarMedicamento = useEliminarMedicamento();

  async function confirmarEliminar() {
    if (!eliminando) return;
    try {
      await eliminarMedicamento.mutateAsync(eliminando.id);
      setEliminando(null);
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
        <NuevoMedicamentoDialog />
      </div>

      {bajoStock && bajoStock.length > 0 && (
        <div className="flex items-start gap-3 rounded-lg border border-amber-300 bg-amber-50 p-4 text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-400">
          <AlertTriangle className="mt-0.5 size-5 shrink-0" />
          <p className="text-sm">
            <span className="font-medium">{bajoStock.length} medicamento(s) con stock bajo:</span>{" "}
            {bajoStock.map((m) => m.nombre).join(", ")}.
          </p>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Medicamentos</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading && (
            <div className="flex flex-col gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          )}

          {isError && <p className="py-8 text-center text-sm text-destructive">No se pudo cargar el inventario.</p>}

          {!isLoading && !isError && medicamentos?.length === 0 && (
            <div className="flex flex-col items-center gap-2 py-12 text-center text-muted-foreground">
              <Package className="size-8" />
              <p>Sin medicamentos registrados todavía.</p>
            </div>
          )}

          {!isLoading && !isError && medicamentos && medicamentos.length > 0 && (
            <div className="overflow-x-auto">
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
                  {medicamentos.map((medicamento) => {
                    const bajo = medicamento.stockActual <= medicamento.stockMinimo;
                    return (
                      <TableRow key={medicamento.id}>
                        <TableCell className="font-medium">{medicamento.nombre}</TableCell>
                        <TableCell>{medicamento.stockActual}</TableCell>
                        <TableCell>{medicamento.stockMinimo}</TableCell>
                        <TableCell>
                          {bajo ? (
                            <Badge className="border-none bg-amber-100 font-medium text-amber-700 dark:bg-amber-500/15 dark:text-amber-400">
                              Bajo stock
                            </Badge>
                          ) : (
                            <Badge className="border-none bg-emerald-100 font-medium text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400">
                              OK
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button size="sm" variant="outline" onClick={() => setSeleccionado(medicamento)}>
                            Registrar entrada
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => setEditando(medicamento)}>
                            Editar
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => setEliminando(medicamento)}>
                            Eliminar
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <RegistrarEntradaDialog medicamento={seleccionado} onClose={() => setSeleccionado(null)} />
      <EditarMedicamentoDialog medicamento={editando} onClose={() => setEditando(null)} />

      <Dialog open={!!eliminando} onOpenChange={(v) => !v && setEliminando(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>¿Eliminar medicamento?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Se eliminará "{eliminando?.nombre}" del catálogo. Si ya tiene movimientos de inventario registrados (entradas o
            consumos en atenciones), no se podrá eliminar.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEliminando(null)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={confirmarEliminar} disabled={eliminarMedicamento.isPending}>
              {eliminarMedicamento.isPending && <Loader2 className="size-4 animate-spin" />}
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
