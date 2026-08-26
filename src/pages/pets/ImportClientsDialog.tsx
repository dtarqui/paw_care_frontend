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
import { useImportClients } from "@/features/imports/useImports";
import type { ImportResult } from "@/features/imports/types";
import { CheckCircle2, FileSpreadsheet, Loader2, Upload } from "lucide-react";
import { useRef, useState } from "react";

export function ImportClientsDialog() {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const importClientsMutation = useImportClients();

  function handleClose() {
    setFile(null);
    setResult(null);
    setError(null);
    setOpen(false);
  }

  async function handleImport() {
    if (!file) return;
    setError(null);
    try {
      const result = await importClientsMutation.mutateAsync(file);
      setResult(result);
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
            El archivo se lee por posición de columna y la primera fila se ignora (es el encabezado). Orden
            esperado: nombre · apellido paterno · apellido materno · CI · teléfono · dirección · nombre de la
            mascota · especie · raza.
          </p>

          <div
            className="flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 border-dashed p-6 text-center hover:bg-accent/40"
            onClick={() => inputRef.current?.click()}
          >
            <Upload className="size-6 text-muted-foreground" />
            <p className="text-sm">{file ? file.name : "Haz clic para elegir un archivo .xlsx"}</p>
            <input
              ref={inputRef}
              type="file"
              accept=".xlsx"
              className="hidden"
              onChange={(e) => {
                setFile(e.target.files?.[0] ?? null);
                setResult(null);
              }}
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          {result && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                <CheckCircle2 className="size-4 shrink-0" />
                {result.imported} pet(s) importada(s) correctamente.
              </div>

              {result.errors.length > 0 && (
                <div>
                  <p className="mb-2 text-sm font-medium text-destructive">{result.errors.length} fila(s) con error:</p>
                  <div className="max-h-48 overflow-y-auto rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Fila</TableHead>
                          <TableHead>Motivo</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {result.errors.map((e) => (
                          <TableRow key={e.row}>
                            <TableCell>{e.row}</TableCell>
                            <TableCell className="text-sm">{e.reason}</TableCell>
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
          <Button type="button" disabled={!file || importClientsMutation.isPending} onClick={handleImport}>
            {importClientsMutation.isPending && <Loader2 className="size-4 animate-spin" />}
            Importar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
