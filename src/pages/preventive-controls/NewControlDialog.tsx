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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCreatePreventiveControl } from "@/features/preventive-controls/usePreventiveControls";
import type { PreventiveControlType } from "@/features/preventive-controls/types";
import type { Pet } from "@/features/pets/types";
import { todayISO } from "@/lib/date";
import { Loader2, Plus } from "lucide-react";
import { useState, type FormEvent } from "react";

const INITIAL_STATE = {
  type: "" as PreventiveControlType | "",
  appliedOn: todayISO(),
  nextDoseOn: "",
};

export function NewControlDialog({ pet }: { pet: Pet }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(INITIAL_STATE);
  const [error, setError] = useState<string | null>(null);
  const createControlMutation = useCreatePreventiveControl();

  function update<K extends keyof typeof INITIAL_STATE>(field: K, value: (typeof INITIAL_STATE)[K]) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleClose() {
    setForm(INITIAL_STATE);
    setError(null);
    setOpen(false);
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);

    if (!form.type) {
      setError("Selecciona el tipo de control");
      return;
    }

    try {
      await createControlMutation.mutateAsync({
        petId: pet.id,
        type: form.type,
        appliedOn: form.appliedOn,
        nextDoseOn: form.nextDoseOn || undefined,
      });
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo registrar el control");
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => (v ? setOpen(true) : handleClose())}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="size-4" />
          Registrar control
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Registrar control — {pet.name} ({pet.species})
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label>Tipo *</Label>
            <Select value={form.type} onValueChange={(v) => update("type", v as PreventiveControlType)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Seleccione tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="VACCINE">Vacuna</SelectItem>
                <SelectItem value="DEWORMING">Desparasitación</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="appliedOn">Fecha de aplicación *</Label>
              <Input
                id="appliedOn"
                type="date"
                required
                value={form.appliedOn}
                onChange={(e) => update("appliedOn", e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="nextDoseOn">Próxima dosis</Label>
              <Input
                id="nextDoseOn"
                type="date"
                value={form.nextDoseOn}
                onChange={(e) => update("nextDoseOn", e.target.value)}
              />
            </div>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={createControlMutation.isPending}>
              {createControlMutation.isPending && <Loader2 className="size-4 animate-spin" />}
              Guardar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
