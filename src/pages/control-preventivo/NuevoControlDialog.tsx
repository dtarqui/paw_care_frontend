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
import { useCrearControlPreventivo } from "@/features/controles-preventivos/useControlesPreventivos";
import type { TipoControlPreventivo } from "@/features/controles-preventivos/types";
import type { Mascota } from "@/features/mascotas/types";
import { todayISO } from "@/lib/date";
import { Loader2, Plus } from "lucide-react";
import { useState, type FormEvent } from "react";

const ESTADO_INICIAL = {
  tipo: "" as TipoControlPreventivo | "",
  fechaAplicacion: todayISO(),
  proximaDosis: "",
};

export function NuevoControlDialog({ mascota }: { mascota: Mascota }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(ESTADO_INICIAL);
  const [error, setError] = useState<string | null>(null);
  const crearControl = useCrearControlPreventivo();

  function actualizar<K extends keyof typeof ESTADO_INICIAL>(campo: K, valor: (typeof ESTADO_INICIAL)[K]) {
    setForm((prev) => ({ ...prev, [campo]: valor }));
  }

  function handleClose() {
    setForm(ESTADO_INICIAL);
    setError(null);
    setOpen(false);
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);

    if (!form.tipo) {
      setError("Selecciona el tipo de control");
      return;
    }

    try {
      await crearControl.mutateAsync({
        mascotaId: mascota.id,
        tipo: form.tipo,
        fechaAplicacion: form.fechaAplicacion,
        proximaDosis: form.proximaDosis || undefined,
      });
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo registrar el control");
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => (v ? setOpen(true) : handleClose())}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="size-4" />
          Registrar control
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Registrar control — {mascota.nombre} ({mascota.especie})
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label>Tipo *</Label>
            <Select value={form.tipo} onValueChange={(v) => actualizar("tipo", v as TipoControlPreventivo)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Seleccione tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="VACUNA">Vacuna</SelectItem>
                <SelectItem value="DESPARASITACION">Desparasitación</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="fechaAplicacion">Fecha de aplicación *</Label>
              <Input
                id="fechaAplicacion"
                type="date"
                required
                value={form.fechaAplicacion}
                onChange={(e) => actualizar("fechaAplicacion", e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="proximaDosis">Próxima dosis</Label>
              <Input
                id="proximaDosis"
                type="date"
                value={form.proximaDosis}
                onChange={(e) => actualizar("proximaDosis", e.target.value)}
              />
            </div>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={crearControl.isPending}>
              {crearControl.isPending && <Loader2 className="size-4 animate-spin" />}
              Guardar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
