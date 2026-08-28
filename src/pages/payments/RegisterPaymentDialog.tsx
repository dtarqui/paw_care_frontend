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
import type { PaymentMethod, PaymentReceipt, PendingPayment } from "@/features/payments/types";
import { PaymentReceiptView } from "./PaymentReceiptView";
import { Loader2 } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";

/** El orden en que se ofrecen los métodos. La etiqueta visible sale de
 * `enums.status.*`, igual que en StatusBadge. */
const PAYMENT_METHODS: PaymentMethod[] = ["CASH", "CARD", "TRANSFER", "QR"];

interface RegisterPaymentDialogProps {
  pendingPayment: PendingPayment | null;
  onClose: () => void;
}

export function RegisterPaymentDialog({ pendingPayment, onClose }: RegisterPaymentDialogProps) {
  const { t } = useTranslation();
  const registerPaymentMutation = useRegisterPayment();
  const [method, setMethod] = useState<PaymentMethod | "">("");
  /** Arranca con el monto de la atención: en la enorme mayoría de los cobros es
   * exactamente ese, y tenerlo como simple placeholder obligaba a teclear una cifra
   * que el sistema ya sabe. Sigue siendo editable para un ajuste puntual. */
  const [amount, setAmount] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  /** Con el cobro hecho el diálogo cambia de cara: deja de ser un formulario y pasa
   * a ser el comprobante. Se queda abierto a propósito — cerrarlo de golpe se lleva
   * el número de comprobante y la posibilidad de entregárselo al cliente. */
  const [receipt, setReceipt] = useState<PaymentReceipt | null>(null);

  // El diálogo se monta con la atención ya elegida, así que el efecto solo corre
  // cuando se pasa de una atención a otra.
  useEffect(() => {
    if (pendingPayment && !receipt) setAmount(String(pendingPayment.amount));
  }, [pendingPayment, receipt]);

  if (!pendingPayment) return null;

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    const amountNumber = Number(amount);
    if (!method) {
      setError(t("payments.form.pickMethod"));
      return;
    }
    if (!amountNumber || amountNumber <= 0) {
      setError(t("payments.form.amountPositive"));
      return;
    }
    try {
      const { payment } = await registerPaymentMutation.mutateAsync({
        visitId: pendingPayment!.visitId,
        method,
        amount: amountNumber,
      });
      setReceipt(payment);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("payments.form.error"));
    }
  }

  function handleClose() {
    setMethod("");
    setAmount("");
    setError(null);
    setReceipt(null);
    onClose();
  }

  return (
    <Dialog open={!!pendingPayment} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {receipt ? t("payments.receipt.dialogTitle") : t("payments.registerPayment")}
          </DialogTitle>
        </DialogHeader>

        {receipt ? (
          <PaymentReceiptView receipt={receipt} onClose={handleClose} />
        ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="rounded-md border bg-muted/40 p-3 text-sm">
            <p className="font-medium">{pendingPayment.pet.name}</p>
            <p className="text-muted-foreground">
              {pendingPayment.owner.firstName} {pendingPayment.owner.paternalLastName} — {pendingPayment.consultationReason}
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <Label>{t("payments.method")}</Label>
            <Select value={method} onValueChange={(v) => setMethod(v as PaymentMethod)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={t("payments.form.pickMethodShort")} />
              </SelectTrigger>
              <SelectContent>
                {PAYMENT_METHODS.map((value) => (
                  <SelectItem key={value} value={value}>
                    {t(`enums.status.${value}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="amount">{t("common.amountBs")}</Label>
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
              {t("common.cancel")}
            </Button>
            <Button type="submit" disabled={registerPaymentMutation.isPending}>
              {registerPaymentMutation.isPending && <Loader2 className="size-4 animate-spin" />}
              {t("payments.confirmPayment")}
            </Button>
          </DialogFooter>
        </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
