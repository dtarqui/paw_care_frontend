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
import { useRegisterPayment } from "@/features/payments/usePayments";
import type { PaymentMethod, PendingPayment } from "@/features/payments/types";
import { Loader2 } from "lucide-react";
import { useState, type FormEvent } from "react";

const METODOS: { value: PaymentMethod; label: string }[] = [
  { value: "CASH", label: "Efectivo" },
  { value: "CARD", label: "Tarjeta" },
  { value: "TRANSFER", label: "Transferencia" },
  { value: "QR", label: "QR" },
];

interface RegistrarPagoDialogProps {
  pendiente: PendingPayment | null;
  onClose: () => void;
}

export function RegisterPaymentDialog({ pendiente, onClose }: RegistrarPagoDialogProps) {
  const registrarPago = useRegisterPayment();
  const [method, setMetodoPago] = useState<PaymentMethod | "">("");
  const [monto, setMonto] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  if (!pendiente) return null;

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    const montoNumero = Number(monto);
    if (!method) {
      setError("Selecciona un método de pago");
      return;
    }
    if (!montoNumero || montoNumero <= 0) {
      setError("El monto debe ser mayor a 0");
      return;
    }
    try {
      await registrarPago.mutateAsync({ visitId: pendiente!.visitId, method, amount: montoNumero });
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
            <p className="font-medium">{pendiente.pet.name}</p>
            <p className="text-muted-foreground">
              {pendiente.owner.firstName} {pendiente.owner.paternalLastName} — {pendiente.consultationReason}
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <Label>Método de pago</Label>
            <Select value={method} onValueChange={(v) => setMetodoPago(v as PaymentMethod)}>
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
            <Label htmlFor="amount">Monto (Bs.)</Label>
            <Input
              id="amount"
              type="number"
              min={1}
              step="0.01"
              value={monto}
              onChange={(e) => setMonto(e.target.value)}
              placeholder={String(pendiente.amount)}
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={registrarPago.isPending}>
              {registrarPago.isPending && <Loader2 className="size-4 animate-spin" />}
              Confirmar payment
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
