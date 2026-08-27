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
import { useUpdatePet } from "@/features/pets/usePets";
import type { Pet } from "@/features/pets/types";
import { Loader2, Pencil } from "lucide-react";
import { SEX_VALUES, SPECIES_VALUES } from "@/lib/pet";
import { useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";

function toFormState(pet: Pet) {
  return {
    name: pet.name,
    species: pet.species,
    breed: pet.breed,
    sex: pet.sex,
    birthDate: pet.birthDate,
    weight: pet.weight ? String(pet.weight) : "",
  };
}

export function EditPetDialog({ pet }: { pet: Pet }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(() => toFormState(pet));
  const [error, setError] = useState<string | null>(null);
  const updatePetMutation = useUpdatePet(pet.id);

  function update<K extends keyof ReturnType<typeof toFormState>>(field: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleOpenChange(v: boolean) {
    if (v) setForm(toFormState(pet));
    setError(null);
    setOpen(v);
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);

    if (!form.name.trim() || !form.species.trim()) {
      setError(t("pets.form.nameAndSpeciesRequired"));
      return;
    }

    try {
      await updatePetMutation.mutateAsync({
        name: form.name.trim(),
        species: form.species.trim(),
        breed: form.breed.trim(),
        sex: form.sex,
        birthDate: form.birthDate || undefined,
        weight: form.weight ? Number(form.weight) : undefined,
      });
      setOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("pets.form.updateError"));
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Pencil className="size-4" />
          {t("common.edit")}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{t("pets.editTitle", { name: pet.name })}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="edit-name">{t("common.name")} *</Label>
              <Input id="edit-name" required value={form.name} onChange={(e) => update("name", e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>{t("pets.species")} *</Label>
              <Select value={form.species} onValueChange={(v) => update("species", v)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={t("common.select")} />
                </SelectTrigger>
                <SelectContent>
                  {SPECIES_VALUES.map((value) => (
                    <SelectItem key={value} value={value}>
                      {t(`enums.species.${value}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="edit-breed">{t("pets.breed")}</Label>
              <Input id="edit-breed" value={form.breed} onChange={(e) => update("breed", e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>{t("pets.sex")} *</Label>
              <Select value={form.sex} onValueChange={(v) => update("sex", v as "Macho" | "Hembra")}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={t("common.select")} />
                </SelectTrigger>
                <SelectContent>
                  {SEX_VALUES.map((value) => (
                    <SelectItem key={value} value={value}>
                      {t(`enums.sex.${value}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="edit-birthDate">{t("pets.birthDate")}</Label>
              <Input
                id="edit-birthDate"
                type="date"
                value={form.birthDate}
                onChange={(e) => update("birthDate", e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="edit-weight">{t("pets.weightKg")}</Label>
              <Input
                id="edit-weight"
                type="number"
                step="0.1"
                min="0"
                value={form.weight}
                onChange={(e) => update("weight", e.target.value)}
              />
            </div>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              {t("common.cancel")}
            </Button>
            <Button type="submit" disabled={updatePetMutation.isPending}>
              {updatePetMutation.isPending && <Loader2 className="size-4 animate-spin" />}
              {t("common.saveChanges")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
