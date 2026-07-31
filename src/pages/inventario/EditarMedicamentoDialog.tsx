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
import { useActualizarMedicamento } from "@/features/medicamentos/useMedicamentos";
import { Loader2 } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";

export function EditarMedicamentoDialog({ medicamento, onClose }: { medicamento: Medicamento | null; onClose: () => void }) {
  const [nombre, setNombre] = useState("");
  const [stockMinimo, setStockMinimo] = useState("");
  const [error, setError] = useState<string | null>(null);
  const actualizarMedicamento = useActualizarMedicamento();

  useEffect(() => {
    if (medicamento) {
      setNombre(medicamento.nombre);
      setStockMinimo(String(medicamento.stockMinimo));
      setError(null);
    }
  }, [medicamento]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    if (!medicamento) return;
    if (!nombre.trim()) {
      setError("El nombre es obligatorio");
      return;
    }
    const valor = Number(stockMinimo);
    if (Number.isNaN(valor) || valor < 0) {
      setError("El stock mínimo debe ser 0 o mayor");
      return;
    }
    try {
      await actualizarMedicamento.mutateAsync({ id: medicamento.id, input: { nombre: nombre.trim(), stockMinimo: valor } });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo actualizar el medicamento");
    }
  }

  return (
    <Dialog open={!!medicamento} onOpenChange={(v) => !v && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar medicamento</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="edit-nombre">Nombre *</Label>
            <Input id="edit-nombre" required value={nombre} onChange={(e) => setNombre(e.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="edit-stockMinimo">Stock mínimo *</Label>
            <Input id="edit-stockMinimo" type="number" min="0" required value={stockMinimo} onChange={(e) => setStockMinimo(e.target.value)} />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={actualizarMedicamento.isPending}>
              {actualizarMedicamento.isPending && <Loader2 className="size-4 animate-spin" />}
              Guardar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
