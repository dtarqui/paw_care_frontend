import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Medicamento } from "@/features/medicamentos/types";
import { useMedicamentos, useMedicamentosBajoStock } from "@/features/medicamentos/useMedicamentos";
import { AlertTriangle, Package } from "lucide-react";
import { useState } from "react";
import { RegistrarEntradaDialog } from "./RegistrarEntradaDialog";

export function InventarioPage() {
  const { data: medicamentos, isLoading, isError } = useMedicamentos();
  const { data: bajoStock } = useMedicamentosBajoStock();
  const [seleccionado, setSeleccionado] = useState<Medicamento | null>(null);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Inventario</h1>
        <p className="text-muted-foreground">Stock de medicamentos</p>
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
                        <TableCell className="text-right">
                          <Button size="sm" variant="outline" onClick={() => setSeleccionado(medicamento)}>
                            Registrar entrada
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
    </div>
  );
}
