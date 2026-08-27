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
import type { OwnerWithPets } from "@/features/owners/types";
import { useUpdateOwner } from "@/features/owners/useOwners";
import { Loader2, Pencil } from "lucide-react";
import { useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";

export function EditOwnerDialog({ owner }: { owner: OwnerWithPets }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    firstName: owner.firstName,
    paternalLastName: owner.paternalLastName,
    phone: owner.phone,
    address: owner.address ?? "",
  });
  const [error, setError] = useState<string | null>(null);
  const updateOwnerMutation = useUpdateOwner();

  function handleOpenChange(v: boolean) {
    if (v)
      setForm({
        firstName: owner.firstName,
        paternalLastName: owner.paternalLastName,
        phone: owner.phone,
        address: owner.address ?? "",
      });
    setError(null);
    setOpen(v);
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);

    if (!form.firstName.trim() || !form.paternalLastName.trim()) {
      setError(t("owners.form.nameRequired"));
      return;
    }

    try {
      await updateOwnerMutation.mutateAsync({
        id: owner.id,
        input: {
          firstName: form.firstName.trim(),
          paternalLastName: form.paternalLastName.trim(),
          phone: form.phone.trim() || undefined,
          address: form.address.trim() || undefined,
        },
      });
      setOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("owners.form.updateError"));
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Pencil className="size-3.5" />
          {t("common.edit")}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t("owners.editTitle")}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label>{t("common.nationalId")}</Label>
            <Input value={owner.nationalId} disabled className="bg-muted/40" />
            <p className="text-xs text-muted-foreground">{t("owners.form.nationalIdLocked")}</p>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="edit-owner-firstName">{t("people.firstName")} *</Label>
              <Input
                id="edit-owner-firstName"
                required
                value={form.firstName}
                onChange={(e) => setForm((prev) => ({ ...prev, firstName: e.target.value }))}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="edit-owner-lastName">{t("people.paternalLastName")} *</Label>
              <Input
                id="edit-owner-lastName"
                required
                value={form.paternalLastName}
                onChange={(e) => setForm((prev) => ({ ...prev, paternalLastName: e.target.value }))}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="edit-owner-phone">{t("common.phone")}</Label>
              <Input
                id="edit-owner-phone"
                value={form.phone}
                onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="edit-owner-address">{t("common.address")}</Label>
              <Input
                id="edit-owner-address"
                value={form.address}
                onChange={(e) => setForm((prev) => ({ ...prev, address: e.target.value }))}
              />
            </div>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              {t("common.cancel")}
            </Button>
            <Button type="submit" disabled={updateOwnerMutation.isPending}>
              {updateOwnerMutation.isPending && <Loader2 className="size-4 animate-spin" />}
              {t("common.saveChanges")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
