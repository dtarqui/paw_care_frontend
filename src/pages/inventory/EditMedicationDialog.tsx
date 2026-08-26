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
import type { Medication } from "@/features/medications/types";
import { useUpdateMedication } from "@/features/medications/useMedications";
import { Loader2 } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";

export function EditMedicationDialog({ medication, onClose }: { medication: Medication | null; onClose: () => void }) {
  const [name, setName] = useState("");
  const [minimumStock, setMinimumStock] = useState("");
  const [error, setError] = useState<string | null>(null);
  const updateMedicationMutation = useUpdateMedication();

  useEffect(() => {
    if (medication) {
      setName(medication.name);
      setMinimumStock(String(medication.minimumStock));
      setError(null);
    }
  }, [medication]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    if (!medication) return;
    if (!name.trim()) {
      setError("El nombre es obligatorio");
      return;
    }
    const value = Number(minimumStock);
    if (Number.isNaN(value) || value < 0) {
      setError("El stock mínimo debe ser 0 o mayor");
      return;
    }
    try {
      await updateMedicationMutation.mutateAsync({ id: medication.id, input: { name: name.trim(), minimumStock: value } });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo actualizar el medicamento");
    }
  }

  return (
    <Dialog open={!!medication} onOpenChange={(v) => !v && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar medicamento</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="edit-nombre">Nombre *</Label>
            <Input id="edit-nombre" required value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="edit-stockMinimo">Stock mínimo *</Label>
            <Input id="edit-stockMinimo" type="number" min="0" required value={minimumStock} onChange={(e) => setMinimumStock(e.target.value)} />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={updateMedicationMutation.isPending}>
              {updateMedicationMutation.isPending && <Loader2 className="size-4 animate-spin" />}
              Guardar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
