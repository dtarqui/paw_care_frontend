import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMedicamentos } from "@/features/medicamentos/useMedicamentos";
import { Plus, X } from "lucide-react";

export interface ItemMedicamento {
  medicamentoId: string;
  cantidad: string;
}

interface MedicamentosConsumidosFieldProps {
  items: ItemMedicamento[];
  onChange: (items: ItemMedicamento[]) => void;
}

export function MedicamentosConsumidosField({ items, onChange }: MedicamentosConsumidosFieldProps) {
  const { data: medicamentos } = useMedicamentos();

  function actualizarItem(index: number, campo: keyof ItemMedicamento, valor: string) {
    const copia = [...items];
    copia[index] = { ...copia[index], [campo]: valor };
    onChange(copia);
  }

  function agregar() {
    onChange([...items, { medicamentoId: "", cantidad: "1" }]);
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
          <Select value={item.medicamentoId} onValueChange={(v) => actualizarItem(index, "medicamentoId", v)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Seleccione medicamento" />
            </SelectTrigger>
            <SelectContent>
              {medicamentos?.map((m) => (
                <SelectItem key={m.id} value={String(m.id)}>
                  {m.nombre} (stock: {m.stockActual})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            type="number"
            min="1"
            className="w-20 shrink-0"
            value={item.cantidad}
            onChange={(e) => actualizarItem(index, "cantidad", e.target.value)}
          />
          <Button type="button" variant="ghost" size="icon" className="shrink-0" onClick={() => quitar(index)}>
            <X className="size-4" />
          </Button>
        </div>
      ))}
    </div>
  );
}
