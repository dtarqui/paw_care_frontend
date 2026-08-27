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
import { useTranslation } from "react-i18next";

export function EditMedicationDialog({ medication, onClose }: { medication: Medication | null; onClose: () => void }) {
  const { t } = useTranslation();
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
      setError(t("inventory.form.nameRequired"));
      return;
    }
    const value = Number(minimumStock);
    if (Number.isNaN(value) || value < 0) {
      setError(t("inventory.form.minimumStockRange"));
      return;
    }
    try {
      await updateMedicationMutation.mutateAsync({ id: medication.id, input: { name: name.trim(), minimumStock: value } });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : t("inventory.form.updateError"));
    }
  }

  return (
    <Dialog open={!!medication} onOpenChange={(v) => !v && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("inventory.editMedication")}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="edit-medication-name">{t("common.name")} *</Label>
            <Input id="edit-medication-name" required value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="edit-minimumStock">{t("inventory.minimumStock")} *</Label>
            <Input id="edit-minimumStock" type="number" min="0" required value={minimumStock} onChange={(e) => setMinimumStock(e.target.value)} />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              {t("common.cancel")}
            </Button>
            <Button type="submit" disabled={updateMedicationMutation.isPending}>
              {updateMedicationMutation.isPending && <Loader2 className="size-4 animate-spin" />}
              {t("common.save")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
