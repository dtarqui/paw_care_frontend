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

const PAYMENT_METHODS: { value: PaymentMethod; label: string }[] = [
  { value: "CASH", label: "Efectivo" },
  { value: "CARD", label: "Tarjeta" },
  { value: "TRANSFER", label: "Transferencia" },
  { value: "QR", label: "QR" },
];

interface RegisterPaymentDialogProps {
  pendingPayment: PendingPayment | null;
  onClose: () => void;
}

export function RegisterPaymentDialog({ pendingPayment, onClose }: RegisterPaymentDialogProps) {
  const registerPaymentMutation = useRegisterPayment();
  const [method, setMethod] = useState<PaymentMethod | "">("");
  const [amount, setAmount] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  if (!pendingPayment) return null;

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    const amountNumber = Number(amount);
    if (!method) {
      setError("Selecciona un método de pago");
      return;
    }
    if (!amountNumber || amountNumber <= 0) {
      setError("El monto debe ser mayor a 0");
      return;
    }
    try {
      await registerPaymentMutation.mutateAsync({ visitId: pendingPayment!.visitId, method, amount: amountNumber });
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo registrar el pago");
    }
  }

  function handleClose() {
    setMethod("");
    setAmount("");
    setError(null);
    onClose();
  }

  return (
    <Dialog open={!!pendingPayment} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Registrar pago</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="rounded-md border bg-muted/40 p-3 text-sm">
            <p className="font-medium">{pendingPayment.pet.name}</p>
            <p className="text-muted-foreground">
              {pendingPayment.owner.firstName} {pendingPayment.owner.paternalLastName} — {pendingPayment.consultationReason}
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <Label>Método de pago</Label>
            <Select value={method} onValueChange={(v) => setMethod(v as PaymentMethod)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecciona un método" />
              </SelectTrigger>
              <SelectContent>
                {PAYMENT_METHODS.map((m) => (
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
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder={String(pendingPayment.amount)}
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={registerPaymentMutation.isPending}>
              {registerPaymentMutation.isPending && <Loader2 className="size-4 animate-spin" />}
              Confirmar payment
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
