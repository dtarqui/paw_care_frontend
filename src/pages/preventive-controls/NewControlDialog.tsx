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
import { VACCINE_SUGGESTIONS } from "@/lib/vaccine-types";
import { Loader2, Plus } from "lucide-react";
import { useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";

const INITIAL_STATE = {
  type: "" as PreventiveControlType | "",
  productName: "",
  batchNumber: "",
  appliedOn: todayISO(),
  nextDoseOn: "",
};

export function NewControlDialog({ pet }: { pet: Pet }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(INITIAL_STATE);
  const [error, setError] = useState<string | null>(null);
  const createControlMutation = useCreatePreventiveControl();
  const isVaccine = form.type !== "DEWORMING";

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
      setError(t("preventive.form.pickType"));
      return;
    }

    try {
      await createControlMutation.mutateAsync({
        petId: pet.id,
        type: form.type,
        productName: form.productName || undefined,
        batchNumber: form.batchNumber || undefined,
        appliedOn: form.appliedOn,
        nextDoseOn: form.nextDoseOn || undefined,
      });
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : t("preventive.form.createError"));
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => (v ? setOpen(true) : handleClose())}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="size-4" />
          {t("preventive.registerControl")}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {t("preventive.registerControlFor", {
              name: pet.name,
              species: t(`enums.species.${pet.species}`, { defaultValue: pet.species }),
            })}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label>{t("common.type")} *</Label>
            <Select value={form.type} onValueChange={(v) => update("type", v as PreventiveControlType)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={t("visits.pickType")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="VACCINE">{t("enums.controlType.VACCINE")}</SelectItem>
                <SelectItem value="DEWORMING">{t("enums.controlType.DEWORMING")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Qué se aplicó y de qué frasco. Opcionales a propósito: en una campaña
              masiva no siempre se anota el lote, y exigirlo llevaría a inventarlo o a
              no cargar el control. El lote es lo que el SENASAG pide para el
              certificado de viaje, así que vale la pena pedirlo aunque no se exija. */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="productName">
                {isVaccine ? t("preventive.form.vaccineLabel") : t("preventive.form.productLabel")}
              </Label>
              <Input
                id="productName"
                list={isVaccine ? "vaccine-suggestions" : undefined}
                maxLength={80}
                placeholder={
                  isVaccine ? t("preventive.form.vaccinePlaceholder") : t("preventive.form.productPlaceholder")
                }
                value={form.productName}
                onChange={(e) => update("productName", e.target.value)}
              />
              {isVaccine && (
                <datalist id="vaccine-suggestions">
                  {VACCINE_SUGGESTIONS.map((vaccine) => (
                    <option key={vaccine} value={vaccine} />
                  ))}
                </datalist>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="batchNumber">{t("preventive.form.batchLabel")}</Label>
              <Input
                id="batchNumber"
                maxLength={40}
                placeholder={t("preventive.form.batchPlaceholder")}
                value={form.batchNumber}
                onChange={(e) => update("batchNumber", e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="appliedOn">{t("preventive.appliedOnLabel")} *</Label>
              <Input
                id="appliedOn"
                type="date"
                required
                value={form.appliedOn}
                onChange={(e) => update("appliedOn", e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="nextDoseOn">{t("preventive.nextDoseLabel")}</Label>
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
              {t("common.cancel")}
            </Button>
            <Button type="submit" disabled={createControlMutation.isPending}>
              {createControlMutation.isPending && <Loader2 className="size-4 animate-spin" />}
              {t("common.save")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
