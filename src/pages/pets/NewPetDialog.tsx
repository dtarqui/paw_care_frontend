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
import { SEX_VALUES, SPECIES_VALUES } from "@/lib/pet";
import { useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
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
      setError(t("pets.form.pickSex"));
      return;
    }
    if (newOwner && (!form.ownerFirstName || !form.ownerPaternalLastName)) {
      setError(t("pets.form.newOwnerNeedsName"));
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
      setError(err instanceof Error ? err.message : t("pets.form.createError"));
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => (v ? setOpen(true) : handleClose())}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="size-4" />
          {t("pets.newPet")}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg overflow-hidden">
        <DialogHeader>
          <DialogTitle>{t("pets.registerPet")}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col gap-4">
          <div className="-mx-1 flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-1 py-0.5">
          <div className="flex flex-col gap-3 rounded-md border p-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="ownerNationalId">{t("pets.form.ownerNationalId")} *</Label>
              <div className="relative">
                <Input
                  id="ownerNationalId"
                  required
                  value={form.ownerNationalId}
                  onChange={(e) => update("ownerNationalId", e.target.value)}
                  placeholder={t("pets.form.nationalIdPlaceholder")}
                />
                {searchingOwner && (
                  <Loader2 className="absolute right-2.5 top-2.5 size-4 animate-spin text-muted-foreground" />
                )}
              </div>
            </div>

            {existingOwner && (
              <div className="flex items-center gap-2 rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                <CheckCircle2 className="size-4 shrink-0" />
                {t("pets.form.existingOwner", {
                  name: `${existingOwner.firstName} ${existingOwner.paternalLastName}`,
                })}{" "}
                · {existingOwner.phone}
              </div>
            )}

            {newOwner && (
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Search className="size-3.5" />
                  {t("pets.form.ownerNotFound")}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="ownerFirstName">{t("people.firstName")} *</Label>
                    <Input
                      id="ownerFirstName"
                      required={newOwner}
                      value={form.ownerFirstName}
                      onChange={(e) => update("ownerFirstName", e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="ownerPaternalLastName">{t("people.paternalLastName")} *</Label>
                    <Input
                      id="ownerPaternalLastName"
                      required={newOwner}
                      value={form.ownerPaternalLastName}
                      onChange={(e) => update("ownerPaternalLastName", e.target.value)}
                    />
                  </div>
                  <div className="col-span-2 flex flex-col gap-1.5">
                    <Label htmlFor="ownerPhone">{t("common.phone")}</Label>
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
              <Label htmlFor="petName">{t("pets.form.petName")} *</Label>
              <Input id="petName" required value={form.name} onChange={(e) => update("name", e.target.value)} />
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
              <Label htmlFor="breed">{t("pets.breed")}</Label>
              <Input id="breed" value={form.breed} onChange={(e) => update("breed", e.target.value)} />
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
              <Label htmlFor="birthDate">{t("pets.birthDate")}</Label>
              <Input
                id="birthDate"
                type="date"
                value={form.birthDate}
                onChange={(e) => update("birthDate", e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="weight">{t("pets.weightKg")}</Label>
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
              {t("common.cancel")}
            </Button>
            <Button type="submit" disabled={createPetMutation.isPending}>
              {createPetMutation.isPending && <Loader2 className="size-4 animate-spin" />}
              {t("common.save")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
