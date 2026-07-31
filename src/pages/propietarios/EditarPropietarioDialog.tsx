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
import type { PropietarioConMascotas } from "@/features/propietarios/types";
import { useActualizarPropietario } from "@/features/propietarios/usePropietarios";
import { Loader2, Pencil } from "lucide-react";
import { useState, type FormEvent } from "react";

export function EditarPropietarioDialog({ propietario }: { propietario: PropietarioConMascotas }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ nombre: propietario.nombre, apellidoPaterno: propietario.apellidoPaterno, telefono: propietario.telefono });
  const [error, setError] = useState<string | null>(null);
  const actualizarPropietario = useActualizarPropietario();

  function handleOpenChange(v: boolean) {
    if (v) setForm({ nombre: propietario.nombre, apellidoPaterno: propietario.apellidoPaterno, telefono: propietario.telefono });
    setError(null);
    setOpen(v);
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);

    if (!form.nombre.trim() || !form.apellidoPaterno.trim()) {
      setError("Nombre y apellido paterno no pueden quedar vacíos");
      return;
    }

    try {
      await actualizarPropietario.mutateAsync({
        id: propietario.id,
        input: { nombre: form.nombre.trim(), apellidoPaterno: form.apellidoPaterno.trim(), telefono: form.telefono.trim() || undefined },
      });
      setOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo actualizar el propietario");
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Pencil className="size-3.5" />
          Editar
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Editar propietario</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label>CI</Label>
            <Input value={propietario.ci} disabled className="bg-muted/40" />
            <p className="text-xs text-muted-foreground">El CI no se puede editar — es la clave usada para buscar al propietario.</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="editPropNombre">Nombre *</Label>
              <Input
                id="editPropNombre"
                required
                value={form.nombre}
                onChange={(e) => setForm((prev) => ({ ...prev, nombre: e.target.value }))}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="editPropApellido">Apellido paterno *</Label>
              <Input
                id="editPropApellido"
                required
                value={form.apellidoPaterno}
                onChange={(e) => setForm((prev) => ({ ...prev, apellidoPaterno: e.target.value }))}
              />
            </div>
            <div className="col-span-2 flex flex-col gap-1.5">
              <Label htmlFor="editPropTelefono">Teléfono</Label>
              <Input
                id="editPropTelefono"
                value={form.telefono}
                onChange={(e) => setForm((prev) => ({ ...prev, telefono: e.target.value }))}
              />
            </div>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={actualizarPropietario.isPending}>
              {actualizarPropietario.isPending && <Loader2 className="size-4 animate-spin" />}
              Guardar cambios
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
