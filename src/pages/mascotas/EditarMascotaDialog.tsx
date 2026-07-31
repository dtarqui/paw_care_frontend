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
import { useActualizarMascota } from "@/features/mascotas/useMascotas";
import type { Mascota } from "@/features/mascotas/types";
import { Loader2, Pencil } from "lucide-react";
import { useState, type FormEvent } from "react";

function aFormulario(mascota: Mascota) {
  return {
    nombre: mascota.nombre,
    especie: mascota.especie,
    raza: mascota.raza,
    sexo: mascota.sexo,
    fechaNacimiento: mascota.fechaNacimiento,
    peso: mascota.peso ? String(mascota.peso) : "",
  };
}

export function EditarMascotaDialog({ mascota }: { mascota: Mascota }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(() => aFormulario(mascota));
  const [error, setError] = useState<string | null>(null);
  const actualizarMascota = useActualizarMascota(mascota.id);

  function actualizar<K extends keyof ReturnType<typeof aFormulario>>(campo: K, valor: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [campo]: valor }));
  }

  function handleOpenChange(v: boolean) {
    if (v) setForm(aFormulario(mascota));
    setError(null);
    setOpen(v);
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);

    if (!form.nombre.trim() || !form.especie.trim()) {
      setError("Nombre y especie no pueden quedar vacíos");
      return;
    }

    try {
      await actualizarMascota.mutateAsync({
        nombre: form.nombre.trim(),
        especie: form.especie.trim(),
        raza: form.raza.trim(),
        sexo: form.sexo,
        fechaNacimiento: form.fechaNacimiento || undefined,
        peso: form.peso ? Number(form.peso) : undefined,
      });
      setOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo actualizar la mascota");
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Pencil className="size-4" />
          Editar
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Editar datos de {mascota.nombre}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="editNombre">Nombre *</Label>
              <Input id="editNombre" required value={form.nombre} onChange={(e) => actualizar("nombre", e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Especie *</Label>
              <Select value={form.especie} onValueChange={(v) => actualizar("especie", v)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Seleccione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Perro">Perro</SelectItem>
                  <SelectItem value="Gato">Gato</SelectItem>
                  <SelectItem value="Otro">Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="editRaza">Raza</Label>
              <Input id="editRaza" value={form.raza} onChange={(e) => actualizar("raza", e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Sexo *</Label>
              <Select value={form.sexo} onValueChange={(v) => actualizar("sexo", v as "Macho" | "Hembra")}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Seleccione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Macho">Macho</SelectItem>
                  <SelectItem value="Hembra">Hembra</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="editFechaNacimiento">Fecha de nacimiento</Label>
              <Input
                id="editFechaNacimiento"
                type="date"
                value={form.fechaNacimiento}
                onChange={(e) => actualizar("fechaNacimiento", e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="editPeso">Peso (kg)</Label>
              <Input
                id="editPeso"
                type="number"
                step="0.1"
                min="0"
                value={form.peso}
                onChange={(e) => actualizar("peso", e.target.value)}
              />
            </div>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={actualizarMascota.isPending}>
              {actualizarMascota.isPending && <Loader2 className="size-4 animate-spin" />}
              Guardar cambios
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
