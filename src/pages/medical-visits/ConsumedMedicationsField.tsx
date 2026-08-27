import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMedications } from "@/features/medications/useMedications";
import { Plus, X } from "lucide-react";
import { useTranslation } from "react-i18next";

export interface MedicationItem {
  medicationId: string;
  quantity: string;
}

interface ConsumedMedicationsFieldProps {
  items: MedicationItem[];
  onChange: (items: MedicationItem[]) => void;
}

export function ConsumedMedicationsField({ items, onChange }: ConsumedMedicationsFieldProps) {
  const { t } = useTranslation();
  const { data: medications } = useMedications();

  function updateItem(index: number, field: keyof MedicationItem, value: string) {
    const copy = [...items];
    copy[index] = { ...copy[index], [field]: value };
    onChange(copy);
  }

  function addItem() {
    onChange([...items, { medicationId: "", quantity: "1" }]);
  }

  function removeItem(index: number) {
    onChange(items.filter((_, i) => i !== index));
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <Label>{t("visits.consumedMedications")}</Label>
        <Button type="button" variant="ghost" size="sm" onClick={addItem}>
          <Plus className="size-3.5" />
          {t("common.add")}
        </Button>
      </div>

      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <Select value={item.medicationId} onValueChange={(v) => updateItem(index, "medicationId", v)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={t("visits.pickMedication")} />
            </SelectTrigger>
            <SelectContent>
              {medications?.map((m) => (
                <SelectItem key={m.id} value={String(m.id)}>
                  {m.name} ({t("inventory.stockShort", { count: m.currentStock })})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            type="number"
            min="1"
            className="w-20 shrink-0"
            value={item.quantity}
            onChange={(e) => updateItem(index, "quantity", e.target.value)}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="shrink-0"
            aria-label={t("common.remove")}
            onClick={() => removeItem(index)}
          >
            <X className="size-4" />
          </Button>
        </div>
      ))}
    </div>
  );
}
