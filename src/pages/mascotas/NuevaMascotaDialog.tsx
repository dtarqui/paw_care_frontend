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
import { useCrearMascota } from "@/features/mascotas/useMascotas";
import { usePropietarioPorCi } from "@/features/propietarios/usePropietarios";
import { CheckCircle2, Loader2, PlusCircle, Search } from "lucide-react";
import { useState, type FormEvent } from "react";

const ESTADO_INICIAL = {
  propietarioCi: "",
  propietarioNombre: "",
  propietarioApellidoPaterno: "",
  propietarioTelefono: "",
  nombre: "",
  especie: "",
  raza: "",
  sexo: "" as "Macho" | "Hembra" | "",
  fechaNacimiento: "",
  peso: "",
};

export function NuevaMascotaDialog() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(ESTADO_INICIAL);
  const [error, setError] = useState<string | null>(null);
  const crearMascota = useCrearMascota();

  const { data: propietarioExistente, isFetching: buscandoPropietario } = usePropietarioPorCi(
    form.propietarioCi || undefined
  );
  const propietarioNuevo = form.propietarioCi.length >= 5 && !buscandoPropietario && !propietarioExistente;

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

    if (!form.sexo) {
      setError("Selecciona el sexo de la mascota");
      return;
    }
    if (propietarioNuevo && (!form.propietarioNombre || !form.propietarioApellidoPaterno)) {
      setError("Como es un propietario nuevo, indica su nombre y apellido paterno");
      return;
    }

    try {
      await crearMascota.mutateAsync({
        nombre: form.nombre,
        especie: form.especie,
        raza: form.raza || undefined,
        sexo: form.sexo,
        fechaNacimiento: form.fechaNacimiento || undefined,
        peso: form.peso ? Number(form.peso) : undefined,
        propietario: {
          ci: form.propietarioCi,
          nombre: propietarioExistente ? undefined : form.propietarioNombre,
          apellidoPaterno: propietarioExistente ? undefined : form.propietarioApellidoPaterno,
          telefono: propietarioExistente ? undefined : form.propietarioTelefono || undefined,
        },
      });
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo registrar la mascota");
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => (v ? setOpen(true) : handleClose())}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="size-4" />
          Nueva Mascota
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg overflow-hidden">
        <DialogHeader>
          <DialogTitle>Registrar mascota</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col gap-4">
          <div className="-mx-1 flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-1 py-0.5">
          <div className="flex flex-col gap-3 rounded-md border p-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="propietarioCi">CI del propietario *</Label>
              <div className="relative">
                <Input
                  id="propietarioCi"
                  required
                  value={form.propietarioCi}
                  onChange={(e) => actualizar("propietarioCi", e.target.value)}
                  placeholder="Ej. 4521367"
                />
                {buscandoPropietario && (
                  <Loader2 className="absolute right-2.5 top-2.5 size-4 animate-spin text-muted-foreground" />
                )}
              </div>
            </div>

            {propietarioExistente && (
              <div className="flex items-center gap-2 rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                <CheckCircle2 className="size-4 shrink-0" />
                Propietario existente: {propietarioExistente.nombre} {propietarioExistente.apellidoPaterno} ·{" "}
                {propietarioExistente.telefono}
              </div>
            )}

            {propietarioNuevo && (
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Search className="size-3.5" />
                  No encontrado — se registrará como propietario nuevo
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="propietarioNombre">Nombre *</Label>
                    <Input
                      id="propietarioNombre"
                      required={propietarioNuevo}
                      value={form.propietarioNombre}
                      onChange={(e) => actualizar("propietarioNombre", e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="propietarioApellidoPaterno">Apellido paterno *</Label>
                    <Input
                      id="propietarioApellidoPaterno"
                      required={propietarioNuevo}
                      value={form.propietarioApellidoPaterno}
                      onChange={(e) => actualizar("propietarioApellidoPaterno", e.target.value)}
                    />
                  </div>
                  <div className="col-span-2 flex flex-col gap-1.5">
                    <Label htmlFor="propietarioTelefono">Teléfono</Label>
                    <Input
                      id="propietarioTelefono"
                      value={form.propietarioTelefono}
                      onChange={(e) => actualizar("propietarioTelefono", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="mascotaNombre">Nombre de la mascota *</Label>
              <Input id="mascotaNombre" required value={form.nombre} onChange={(e) => actualizar("nombre", e.target.value)} />
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
              <Label htmlFor="raza">Raza</Label>
              <Input id="raza" value={form.raza} onChange={(e) => actualizar("raza", e.target.value)} />
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
              <Label htmlFor="fechaNacimiento">Fecha de nacimiento</Label>
              <Input
                id="fechaNacimiento"
                type="date"
                value={form.fechaNacimiento}
                onChange={(e) => actualizar("fechaNacimiento", e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="peso">Peso (kg)</Label>
              <Input
                id="peso"
                type="number"
                step="0.1"
                min="0"
                value={form.peso}
                onChange={(e) => actualizar("peso", e.target.value)}
              />
            </div>
          </div>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={crearMascota.isPending}>
              {crearMascota.isPending && <Loader2 className="size-4 animate-spin" />}
              Guardar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
