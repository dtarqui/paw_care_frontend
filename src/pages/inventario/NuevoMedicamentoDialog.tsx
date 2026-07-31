import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCrearMedicamento } from "@/features/medicamentos/useMedicamentos";
import { Loader2, Plus } from "lucide-react";
import { useState, type FormEvent } from "react";

const ESTADO_INICIAL = { nombre: "", stockMinimo: "", stockInicial: "" };

export function NuevoMedicamentoDialog() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(ESTADO_INICIAL);
  const [error, setError] = useState<string | null>(null);
  const crearMedicamento = useCrearMedicamento();

  function handleClose() {
    setForm(ESTADO_INICIAL);
    setError(null);
    setOpen(false);
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    if (!form.nombre.trim()) {
      setError("El nombre es obligatorio");
      return;
    }
    const stockMinimo = Number(form.stockMinimo);
    if (Number.isNaN(stockMinimo) || stockMinimo < 0) {
      setError("El stock mínimo debe ser 0 o mayor");
      return;
    }
    try {
      await crearMedicamento.mutateAsync({
        nombre: form.nombre.trim(),
        stockMinimo,
        stockInicial: form.stockInicial ? Number(form.stockInicial) : undefined,
      });
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo crear el medicamento");
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => (v ? setOpen(true) : handleClose())}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="size-4" />
          Nuevo medicamento
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nuevo medicamento</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="nombre">Nombre *</Label>
            <Input id="nombre" required value={form.nombre} onChange={(e) => setForm((p) => ({ ...p, nombre: e.target.value }))} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="stockMinimo">Stock mínimo *</Label>
              <Input
                id="stockMinimo"
                type="number"
                min="0"
                required
                value={form.stockMinimo}
                onChange={(e) => setForm((p) => ({ ...p, stockMinimo: e.target.value }))}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="stockInicial">Stock inicial</Label>
              <Input
                id="stockInicial"
                type="number"
                min="0"
                value={form.stockInicial}
                onChange={(e) => setForm((p) => ({ ...p, stockInicial: e.target.value }))}
                placeholder="0"
              />
            </div>
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={crearMedicamento.isPending}>
              {crearMedicamento.isPending && <Loader2 className="size-4 animate-spin" />}
              Crear
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
