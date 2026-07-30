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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRegistrarPago } from "@/features/pagos/usePagos";
import type { MetodoPago, PagoPendiente } from "@/features/pagos/types";
import { Loader2 } from "lucide-react";
import { useState, type FormEvent } from "react";

const METODOS: { value: MetodoPago; label: string }[] = [
  { value: "EFECTIVO", label: "Efectivo" },
  { value: "TARJETA", label: "Tarjeta" },
  { value: "TRANSFERENCIA", label: "Transferencia" },
  { value: "QR", label: "QR" },
];

interface RegistrarPagoDialogProps {
  pendiente: PagoPendiente | null;
  onClose: () => void;
}

export function RegistrarPagoDialog({ pendiente, onClose }: RegistrarPagoDialogProps) {
  const registrarPago = useRegistrarPago();
  const [metodoPago, setMetodoPago] = useState<MetodoPago | "">("");
  const [monto, setMonto] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  if (!pendiente) return null;

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    const montoNumero = Number(monto);
    if (!metodoPago) {
      setError("Selecciona un método de pago");
      return;
    }
    if (!montoNumero || montoNumero <= 0) {
      setError("El monto debe ser mayor a 0");
      return;
    }
    try {
      await registrarPago.mutateAsync({ atencionId: pendiente!.atencionId, metodoPago, monto: montoNumero });
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo registrar el pago");
    }
  }

  function handleClose() {
    setMetodoPago("");
    setMonto("");
    setError(null);
    onClose();
  }

  return (
    <Dialog open={!!pendiente} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Registrar pago</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="rounded-md border bg-muted/40 p-3 text-sm">
            <p className="font-medium">{pendiente.mascota.nombre}</p>
            <p className="text-muted-foreground">
              {pendiente.propietario.nombre} {pendiente.propietario.apellidoPaterno} — {pendiente.motivoConsulta}
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <Label>Método de pago</Label>
            <Select value={metodoPago} onValueChange={(v) => setMetodoPago(v as MetodoPago)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecciona un método" />
              </SelectTrigger>
              <SelectContent>
                {METODOS.map((m) => (
                  <SelectItem key={m.value} value={m.value}>
                    {m.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="monto">Monto (Bs.)</Label>
            <Input
              id="monto"
              type="number"
              min={1}
              step="0.01"
              value={monto}
              onChange={(e) => setMonto(e.target.value)}
              placeholder={String(pendiente.monto)}
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={registrarPago.isPending}>
              {registrarPago.isPending && <Loader2 className="size-4 animate-spin" />}
              Confirmar pago
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
