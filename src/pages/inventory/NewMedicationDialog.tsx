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
import { useTranslation } from "react-i18next";

const INITIAL_STATE = { name: "", minimumStock: "", initialStock: "", batchNumber: "", expiresOn: "" };

export function NewMedicationDialog() {
  const { t } = useTranslation();
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
      setError(t("inventory.form.nameRequired"));
      return;
    }
    const minimumStock = Number(form.minimumStock);
    if (Number.isNaN(minimumStock) || minimumStock < 0) {
      setError(t("inventory.form.minimumStockRange"));
      return;
    }
    try {
      await createMedicationMutation.mutateAsync({
        name: form.name.trim(),
        minimumStock,
        initialStock: form.initialStock ? Number(form.initialStock) : undefined,
        batchNumber: form.batchNumber.trim() || undefined,
        expiresOn: form.expiresOn || undefined,
      });
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : t("inventory.form.createError"));
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => (v ? setOpen(true) : handleClose())}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="size-4" />
          {t("inventory.newMedication")}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("inventory.newMedication")}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="name">{t("common.name")} *</Label>
            <Input id="name" required value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="minimumStock">{t("inventory.minimumStock")} *</Label>
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
              <Label htmlFor="initialStock">{t("inventory.initialStock")}</Label>
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

          {/* El stock inicial entra como su primer lote. Sin fecha no hay aviso de
              vencimiento posible, así que conviene cargarla desde el principio. */}
          {Number(form.initialStock) > 0 && (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="newBatchNumber">{t("inventory.batchNumber")}</Label>
                <Input
                  id="newBatchNumber"
                  maxLength={40}
                  value={form.batchNumber}
                  onChange={(e) => setForm((p) => ({ ...p, batchNumber: e.target.value }))}
                  placeholder={t("inventory.batchNumberPlaceholder")}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="newExpiresOn">{t("inventory.expiresOn")}</Label>
                <Input
                  id="newExpiresOn"
                  type="date"
                  value={form.expiresOn}
                  onChange={(e) => setForm((p) => ({ ...p, expiresOn: e.target.value }))}
                />
              </div>
            </div>
          )}
          {error && <p className="text-sm text-destructive">{error}</p>}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              {t("common.cancel")}
            </Button>
            <Button type="submit" disabled={createMedicationMutation.isPending}>
              {createMedicationMutation.isPending && <Loader2 className="size-4 animate-spin" />}
              {t("common.create")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
