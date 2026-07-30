import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useImportarClientes } from "@/features/importaciones/useImportaciones";
import type { ResultadoImportacion } from "@/features/importaciones/types";
import { CheckCircle2, FileSpreadsheet, Loader2, Upload } from "lucide-react";
import { useRef, useState } from "react";

export function ImportarClientesDialog() {
  const [open, setOpen] = useState(false);
  const [archivo, setArchivo] = useState<File | null>(null);
  const [resultado, setResultado] = useState<ResultadoImportacion | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const importarClientes = useImportarClientes();

  function handleClose() {
    setArchivo(null);
    setResultado(null);
    setError(null);
    setOpen(false);
  }

  async function handleImportar() {
    if (!archivo) return;
    setError(null);
    try {
      const resultado = await importarClientes.mutateAsync(archivo);
      setResultado(resultado);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo importar el archivo");
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => (v ? setOpen(true) : handleClose())}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <FileSpreadsheet className="size-4" />
          Importar Excel
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Importar clientes desde Excel</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <p className="text-sm text-muted-foreground">
            Columnas esperadas (fila 1 = encabezado): nombre, apellidoPaterno, apellidoMaterno, ci, telefono, direccion,
            mascotaNombre, mascotaEspecie, mascotaRaza.
          </p>

          <div
            className="flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 border-dashed p-6 text-center hover:bg-accent/40"
            onClick={() => inputRef.current?.click()}
          >
            <Upload className="size-6 text-muted-foreground" />
            <p className="text-sm">{archivo ? archivo.name : "Haz clic para elegir un archivo .xlsx"}</p>
            <input
              ref={inputRef}
              type="file"
              accept=".xlsx"
              className="hidden"
              onChange={(e) => {
                setArchivo(e.target.files?.[0] ?? null);
                setResultado(null);
              }}
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          {resultado && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                <CheckCircle2 className="size-4 shrink-0" />
                {resultado.importados} mascota(s) importada(s) correctamente.
              </div>

              {resultado.errores.length > 0 && (
                <div>
                  <p className="mb-2 text-sm font-medium text-destructive">{resultado.errores.length} fila(s) con error:</p>
                  <div className="max-h-48 overflow-y-auto rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Fila</TableHead>
                          <TableHead>Motivo</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {resultado.errores.map((e) => (
                          <TableRow key={e.fila}>
                            <TableCell>{e.fila}</TableCell>
                            <TableCell className="text-sm">{e.motivo}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={handleClose}>
            Cerrar
          </Button>
          <Button type="button" disabled={!archivo || importarClientes.isPending} onClick={handleImportar}>
            {importarClientes.isPending && <Loader2 className="size-4 animate-spin" />}
            Importar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
