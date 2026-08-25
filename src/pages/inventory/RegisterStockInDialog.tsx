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
import { useRegisterStockIn } from "@/features/medications/useMedications";
import { Loader2 } from "lucide-react";
import { useState, type FormEvent } from "react";

export function RegisterStockInDialog({ medication, onClose }: { medication: Medication | null; onClose: () => void }) {
  const [quantity, setCantidad] = useState("");
  const [error, setError] = useState<string | null>(null);
  const registrarEntrada = useRegisterStockIn();

  if (!medication) return null;

  function handleClose() {
    setCantidad("");
    setError(null);
    onClose();
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    const valor = Number(quantity);
    if (!valor || valor <= 0) {
      setError("La cantidad debe ser mayor a 0");
      return;
    }
    try {
      await registrarEntrada.mutateAsync({ medicationId: medication!.id, quantity: valor });
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo registrar la entrada");
    }
  }

  return (
    <Dialog open={!!medication} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Registrar entrada — {medication.name}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="quantity">Cantidad a ingresar</Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setCantidad(e.target.value)}
              placeholder={`Stock actual: ${medication.currentStock}`}
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
