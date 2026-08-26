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
import { useCreateMedication } from "@/features/medications/useMedications";
import { Loader2, Plus } from "lucide-react";
import { useState, type FormEvent } from "react";

const INITIAL_STATE = { name: "", minimumStock: "", initialStock: "" };

export function NewMedicationDialog() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(INITIAL_STATE);
  const [error, setError] = useState<string | null>(null);
  const createMedicationMutation = useCreateMedication();

  function handleClose() {
    setForm(INITIAL_STATE);
    setError(null);
    setOpen(false);
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    if (!form.name.trim()) {
      setError("El nombre es obligatorio");
      return;
    }
    const minimumStock = Number(form.minimumStock);
    if (Number.isNaN(minimumStock) || minimumStock < 0) {
      setError("El stock mínimo debe ser 0 o mayor");
      return;
    }
    try {
      await createMedicationMutation.mutateAsync({
        name: form.name.trim(),
        minimumStock,
        initialStock: form.initialStock ? Number(form.initialStock) : undefined,
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
            <Label htmlFor="name">Nombre *</Label>
            <Input id="name" required value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="minimumStock">Stock mínimo *</Label>
              <Input
                id="minimumStock"
                type="number"
                min="0"
                required
                value={form.minimumStock}
                onChange={(e) => setForm((p) => ({ ...p, minimumStock: e.target.value }))}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="initialStock">Stock inicial</Label>
              <Input
                id="initialStock"
                type="number"
                min="0"
                value={form.initialStock}
                onChange={(e) => setForm((p) => ({ ...p, initialStock: e.target.value }))}
                placeholder="0"
              />
            </div>
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={createMedicationMutation.isPending}>
              {createMedicationMutation.isPending && <Loader2 className="size-4 animate-spin" />}
              Crear
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
