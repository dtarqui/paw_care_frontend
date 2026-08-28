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
import { useTranslation } from "react-i18next";

export function RegisterStockInDialog({ medication, onClose }: { medication: Medication | null; onClose: () => void }) {
  const { t } = useTranslation();
  const [quantity, setQuantity] = useState("");
  const [batchNumber, setBatchNumber] = useState("");
  const [expiresOn, setExpiresOn] = useState("");
  const [error, setError] = useState<string | null>(null);
  const registerStockInMutation = useRegisterStockIn();

  if (!medication) return null;

  function handleClose() {
    setQuantity("");
    setBatchNumber("");
    setExpiresOn("");
    setError(null);
    onClose();
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    const value = Number(quantity);
    if (!value || value <= 0) {
      setError(t("inventory.form.quantityPositive"));
      return;
    }
    try {
      await registerStockInMutation.mutateAsync({
        medicationId: medication!.id,
        quantity: value,
        batchNumber: batchNumber.trim() || undefined,
        expiresOn: expiresOn || undefined,
      });
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : t("inventory.form.stockInError"));
    }
  }

  return (
    <Dialog open={!!medication} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("inventory.registerStockInFor", { name: medication.name })}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="quantity">{t("inventory.quantityToAdd")}</Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder={t("inventory.currentStockIs", { count: medication.currentStock })}
            />
          </div>

          {/* Cada entrada es un lote: dos compras del mismo medicamento vencen en
              fechas distintas, y mezclarlas es lo que impide avisar a tiempo. Van
              opcionales porque hay insumos sin fecha en la caja. */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="batchNumber">{t("inventory.batchNumber")}</Label>
              <Input
                id="batchNumber"
                maxLength={40}
                value={batchNumber}
                onChange={(e) => setBatchNumber(e.target.value)}
                placeholder={t("inventory.batchNumberPlaceholder")}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="expiresOn">{t("inventory.expiresOn")}</Label>
              <Input id="expiresOn" type="date" value={expiresOn} onChange={(e) => setExpiresOn(e.target.value)} />
            </div>
          </div>
          <p className="text-xs text-muted-foreground">{t("inventory.form.batchHint")}</p>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              {t("common.cancel")}
            </Button>
            <Button type="submit" disabled={registerStockInMutation.isPending}>
              {registerStockInMutation.isPending && <Loader2 className="size-4 animate-spin" />}
              {t("common.register")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
