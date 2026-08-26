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
import { useCreatePet } from "@/features/pets/usePets";
import { useOwnerByNationalId } from "@/features/owners/useOwners";
import { CheckCircle2, Loader2, PlusCircle, Search } from "lucide-react";
import { useState, type FormEvent } from "react";

const INITIAL_STATE = {
  ownerNationalId: "",
  ownerFirstName: "",
  ownerPaternalLastName: "",
  ownerPhone: "",
  name: "",
  species: "",
  breed: "",
  sex: "" as "Macho" | "Hembra" | "",
  birthDate: "",
  weight: "",
};

export function NewPetDialog() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(INITIAL_STATE);
  const [error, setError] = useState<string | null>(null);
  const createPetMutation = useCreatePet();

  const { data: existingOwner, isFetching: searchingOwner } = useOwnerByNationalId(
    form.ownerNationalId || undefined
  );
  const newOwner = form.ownerNationalId.length >= 5 && !searchingOwner && !existingOwner;

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

    if (!form.sex) {
      setError("Selecciona el sexo de la mascota");
      return;
    }
    if (newOwner && (!form.ownerFirstName || !form.ownerPaternalLastName)) {
      setError("Como es un propietario nuevo, indica su nombre y apellido paterno");
      return;
    }

    try {
      await createPetMutation.mutateAsync({
        name: form.name,
        species: form.species,
        breed: form.breed || undefined,
        sex: form.sex,
        birthDate: form.birthDate || undefined,
        weight: form.weight ? Number(form.weight) : undefined,
        owner: {
          nationalId: form.ownerNationalId,
          firstName: existingOwner ? undefined : form.ownerFirstName,
          paternalLastName: existingOwner ? undefined : form.ownerPaternalLastName,
          phone: existingOwner ? undefined : form.ownerPhone || undefined,
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
          Nueva mascota
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
              <Label htmlFor="ownerNationalId">CI del propietario *</Label>
              <div className="relative">
                <Input
                  id="ownerNationalId"
                  required
                  value={form.ownerNationalId}
                  onChange={(e) => update("ownerNationalId", e.target.value)}
                  placeholder="Ej. 4521367"
                />
                {searchingOwner && (
                  <Loader2 className="absolute right-2.5 top-2.5 size-4 animate-spin text-muted-foreground" />
                )}
              </div>
            </div>

            {existingOwner && (
              <div className="flex items-center gap-2 rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                <CheckCircle2 className="size-4 shrink-0" />
                Owner existente: {existingOwner.firstName} {existingOwner.paternalLastName} ·{" "}
                {existingOwner.phone}
              </div>
            )}

            {newOwner && (
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Search className="size-3.5" />
                  No encontrado — se registrará como propietario nuevo
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="ownerFirstName">Nombre *</Label>
                    <Input
                      id="ownerFirstName"
                      required={newOwner}
                      value={form.ownerFirstName}
                      onChange={(e) => update("ownerFirstName", e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="ownerPaternalLastName">Apellido paterno *</Label>
                    <Input
                      id="ownerPaternalLastName"
                      required={newOwner}
                      value={form.ownerPaternalLastName}
                      onChange={(e) => update("ownerPaternalLastName", e.target.value)}
                    />
                  </div>
                  <div className="col-span-2 flex flex-col gap-1.5">
                    <Label htmlFor="ownerPhone">Teléfono</Label>
                    <Input
                      id="ownerPhone"
                      value={form.ownerPhone}
                      onChange={(e) => update("ownerPhone", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="mascotaNombre">Nombre de la mascota *</Label>
              <Input id="mascotaNombre" required value={form.name} onChange={(e) => update("name", e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Especie *</Label>
              <Select value={form.species} onValueChange={(v) => update("species", v)}>
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
              <Label htmlFor="breed">Raza</Label>
              <Input id="breed" value={form.breed} onChange={(e) => update("breed", e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Sexo *</Label>
              <Select value={form.sex} onValueChange={(v) => update("sex", v as "Macho" | "Hembra")}>
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
              <Label htmlFor="birthDate">Fecha de nacimiento</Label>
              <Input
                id="birthDate"
                type="date"
                value={form.birthDate}
                onChange={(e) => update("birthDate", e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="weight">Peso (kg)</Label>
              <Input
                id="weight"
                type="number"
                step="0.1"
                min="0"
                value={form.weight}
                onChange={(e) => update("weight", e.target.value)}
              />
            </div>
          </div>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={createPetMutation.isPending}>
              {createPetMutation.isPending && <Loader2 className="size-4 animate-spin" />}
              Guardar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
