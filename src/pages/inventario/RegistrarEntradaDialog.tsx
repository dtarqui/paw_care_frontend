import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Medicamento } from "@/features/medicamentos/types";
import { useRegistrarEntrada } from "@/features/medicamentos/useMedicamentos";
import { Loader2 } from "lucide-react";
import { useState, type FormEvent } from "react";

export function RegistrarEntradaDialog({ medicamento, onClose }: { medicamento: Medicamento | null; onClose: () => void }) {
  const [cantidad, setCantidad] = useState("");
  const [error, setError] = useState<string | null>(null);
  const registrarEntrada = useRegistrarEntrada();

  if (!medicamento) return null;

  function handleClose() {
    setCantidad("");
    setError(null);
    onClose();
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    const valor = Number(cantidad);
    if (!valor || valor <= 0) {
      setError("La cantidad debe ser mayor a 0");
      return;
    }
    try {
      await registrarEntrada.mutateAsync({ medicamentoId: medicamento!.id, cantidad: valor });
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo registrar la entrada");
    }
  }

  return (
    <Dialog open={!!medicamento} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Registrar entrada — {medicamento.nombre}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="cantidad">Cantidad a ingresar</Label>
            <Input
              id="cantidad"
              type="number"
              min="1"
              value={cantidad}
              onChange={(e) => setCantidad(e.target.value)}
              placeholder={`Stock actual: ${medicamento.stockActual}`}
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={registrarEntrada.isPending}>
              {registrarEntrada.isPending && <Loader2 className="size-4 animate-spin" />}
              Registrar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
