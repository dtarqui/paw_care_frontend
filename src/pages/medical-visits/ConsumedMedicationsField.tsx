import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMedications } from "@/features/medications/useMedications";
import { Plus, X } from "lucide-react";

export interface MedicationItem {
  medicationId: string;
  quantity: string;
}

interface MedicamentosConsumidosFieldProps {
  items: MedicationItem[];
  onChange: (items: MedicationItem[]) => void;
}

export function ConsumedMedicationsField({ items, onChange }: MedicamentosConsumidosFieldProps) {
  const { data: medications } = useMedications();

  function actualizarItem(index: number, field: keyof MedicationItem, valor: string) {
    const copia = [...items];
    copia[index] = { ...copia[index], [field]: valor };
    onChange(copia);
  }

  function agregar() {
    onChange([...items, { medicationId: "", quantity: "1" }]);
  }

  function quitar(index: number) {
    onChange(items.filter((_, i) => i !== index));
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <Label>Medicamentos consumidos (opcional)</Label>
        <Button type="button" variant="ghost" size="sm" onClick={agregar}>
          <Plus className="size-3.5" />
          Agregar
        </Button>
      </div>

      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <Select value={item.medicationId} onValueChange={(v) => actualizarItem(index, "medicationId", v)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Seleccione medicamento" />
            </SelectTrigger>
            <SelectContent>
              {medications?.map((m) => (
                <SelectItem key={m.id} value={String(m.id)}>
                  {m.name} (stock: {m.currentStock})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            type="number"
            min="1"
            className="w-20 shrink-0"
            value={item.quantity}
            onChange={(e) => actualizarItem(index, "quantity", e.target.value)}
          />
          <Button type="button" variant="ghost" size="icon" className="shrink-0" onClick={() => quitar(index)}>
            <X className="size-4" />
          </Button>
        </div>
      ))}
    </div>
  );
}
