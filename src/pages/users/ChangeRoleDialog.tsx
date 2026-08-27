import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Role } from "@/features/auth/types";
import type { User } from "@/features/users/types";
import { useChangeUserRole } from "@/features/users/useUsers";
import { ROLE_VALUES } from "@/lib/roles";
import { Loader2 } from "lucide-react";
import { useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";

export function ChangeRoleDialog({ user, onClose }: { user: User | null; onClose: () => void }) {
  const { t } = useTranslation();
  const [role, setRole] = useState<Role | "">("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [error, setError] = useState<string | null>(null);
  const changeRoleMutation = useChangeUserRole();

  const chosenRole = role || user?.role || "";
  const requiresVetData = chosenRole === "VET" && user?.role !== "VET";

  function resetAndClose() {
    setRole("");
    setLicenseNumber("");
    setSpecialty("");
    setError(null);
    onClose();
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    if (!user || !chosenRole) return;
    if (requiresVetData && (!licenseNumber || !specialty)) {
      setError(t("users.form.vetDataRequiredToConvert"));
      return;
    }
    try {
      await changeRoleMutation.mutateAsync({
        id: user.id,
        input: { role: chosenRole as Role, licenseNumber: licenseNumber || undefined, specialty: specialty || undefined },
      });
      resetAndClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : t("users.form.changeRoleError"));
    }
  }

  return (
    <Dialog open={!!user} onOpenChange={(v) => !v && resetAndClose()}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>{t("users.changeRole")}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <p className="text-sm text-muted-foreground">
            {user?.firstName} {user?.paternalLastName} —{" "}
            {t("users.currentRole", { role: user ? t(`enums.role.${user.role}`) : "" })}
          </p>

          <div className="flex flex-col gap-1.5">
            <Label>{t("users.newRole")}</Label>
            <Select value={chosenRole} onValueChange={(v) => setRole(v as Role)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={t("users.form.pickRole")} />
              </SelectTrigger>
              <SelectContent>
                {ROLE_VALUES.map((value) => (
                  <SelectItem key={value} value={value}>
                    {t(`enums.role.${value}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {requiresVetData && (
            <div className="flex flex-col gap-3 rounded-md border bg-muted/40 p-3">
              <div className="text-xs font-medium text-muted-foreground">{t("users.form.vetSectionRequired")}</div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="licenseNumber">{t("people.licenseNumber")} *</Label>
                <Input id="licenseNumber" value={licenseNumber} onChange={(e) => setLicenseNumber(e.target.value)} placeholder="VET-0XX" />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="specialty">{t("people.specialty")} *</Label>
                <Input id="specialty" value={specialty} onChange={(e) => setSpecialty(e.target.value)} />
              </div>
            </div>
          )}

          {error && <p className="text-sm text-destructive">{error}</p>}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={resetAndClose}>
              {t("common.cancel")}
            </Button>
            <Button type="submit" disabled={changeRoleMutation.isPending || !chosenRole || chosenRole === user?.role}>
              {changeRoleMutation.isPending && <Loader2 className="size-4 animate-spin" />}
              {t("common.save")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
