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
import type { Role } from "@/features/auth/types";
import { useCreateUser } from "@/features/users/useUsers";
import { ROLE_VALUES } from "@/lib/roles";
import { Loader2, UserPlus } from "lucide-react";
import { useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";

const INITIAL_STATE = {
  firstName: "",
  paternalLastName: "",
  maternalLastName: "",
  nationalId: "",
  email: "",
  phone: "",
  username: "",
  role: "" as Role | "",
  password: "",
  confirmPassword: "",
  licenseNumber: "",
  specialty: "",
};

export function NewUserDialog() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(INITIAL_STATE);
  const [error, setError] = useState<string | null>(null);
  const createUserMutation = useCreateUser();

  const isVet = form.role === "VET";

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

    if (!form.role) {
      setError(t("users.form.pickRole"));
      return;
    }
    if (form.password.length < 6) {
      setError(t("auth.passwordTooShort"));
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError(t("auth.passwordsDoNotMatch"));
      return;
    }
    if (isVet && (!form.licenseNumber || !form.specialty)) {
      setError(t("users.form.vetDataRequired"));
      return;
    }

    try {
      await createUserMutation.mutateAsync({
        firstName: form.firstName,
        paternalLastName: form.paternalLastName,
        maternalLastName: form.maternalLastName || undefined,
        nationalId: form.nationalId,
        email: form.email || undefined,
        phone: form.phone || undefined,
        username: form.username,
        role: form.role,
        password: form.password,
        licenseNumber: isVet ? form.licenseNumber : undefined,
        specialty: isVet ? form.specialty : undefined,
      });
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : t("users.form.createError"));
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => (v ? setOpen(true) : handleClose())}>
      <DialogTrigger asChild>
        <Button>
          <UserPlus className="size-4" />
          {t("users.newUser")}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-xl overflow-hidden">
        <DialogHeader>
          <DialogTitle>{t("users.newUser")}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col gap-4">
          <div className="-mx-1 flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-1 py-0.5">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="firstName">{t("people.firstName")} *</Label>
              <Input id="firstName" required value={form.firstName} onChange={(e) => update("firstName", e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="paternalLastName">{t("people.paternalLastName")} *</Label>
              <Input
                id="paternalLastName"
                required
                value={form.paternalLastName}
                onChange={(e) => update("paternalLastName", e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="maternalLastName">{t("people.maternalLastName")}</Label>
              <Input
                id="maternalLastName"
                value={form.maternalLastName}
                onChange={(e) => update("maternalLastName", e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="nationalId">{t("common.nationalId")} *</Label>
              <Input id="nationalId" required value={form.nationalId} onChange={(e) => update("nationalId", e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email">{t("common.email")}</Label>
              <Input id="email" type="email" value={form.email} onChange={(e) => update("email", e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="phone">{t("common.phone")}</Label>
              <Input id="phone" value={form.phone} onChange={(e) => update("phone", e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>{t("common.role")} *</Label>
              <Select value={form.role} onValueChange={(v) => update("role", v as Role)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={t("users.form.pickRole")} />
                </SelectTrigger>
                <SelectContent>
                  {ROLE_VALUES.map((role) => (
                    <SelectItem key={role} value={role}>
                      {t(`enums.role.${role}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {isVet && (
            <div className="grid grid-cols-2 gap-3 rounded-md border bg-muted/40 p-3">
              <div className="col-span-2 text-xs font-medium text-muted-foreground">
                {t("users.form.vetSection")}
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="licenseNumber">{t("people.licenseNumber")} *</Label>
                <Input
                  id="licenseNumber"
                  required={isVet}
                  value={form.licenseNumber}
                  onChange={(e) => update("licenseNumber", e.target.value)}
                  placeholder="VET-0XX"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="specialty">{t("people.specialty")} *</Label>
                <Input
                  id="specialty"
                  required={isVet}
                  value={form.specialty}
                  onChange={(e) => update("specialty", e.target.value)}
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="username">{t("common.username")} *</Label>
              <Input id="username" required value={form.username} onChange={(e) => update("username", e.target.value)} />
            </div>
            <div />
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="password">{t("common.password")} *</Label>
              <Input
                id="password"
                type="password"
                required
                minLength={6}
                value={form.password}
                onChange={(e) => update("password", e.target.value)}
                placeholder={t("auth.minSixCharacters")}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="confirmPassword">{t("auth.confirmPassword")} *</Label>
              <Input
                id="confirmPassword"
                type="password"
                required
                value={form.confirmPassword}
                onChange={(e) => update("confirmPassword", e.target.value)}
              />
            </div>
          </div>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              {t("common.cancel")}
            </Button>
            <Button type="submit" disabled={createUserMutation.isPending}>
              {createUserMutation.isPending && <Loader2 className="size-4 animate-spin" />}
              {t("users.registerUser")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
