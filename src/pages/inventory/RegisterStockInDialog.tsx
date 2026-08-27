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
  const [error, setError] = useState<string | null>(null);
  const registerStockInMutation = useRegisterStockIn();

  if (!medication) return null;

  function handleClose() {
    setQuantity("");
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
      await registerStockInMutation.mutateAsync({ medicationId: medication!.id, quantity: value });
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
