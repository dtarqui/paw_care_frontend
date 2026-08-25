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
import { useChangeMyPassword } from "@/features/users/useUsers";
import { KeyRound, Loader2 } from "lucide-react";
import { useState, type FormEvent } from "react";

const ESTADO_INICIAL = { currentPassword: "", newPassword: "", confirmPassword: "" };

export function ChangePasswordDialog() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(ESTADO_INICIAL);
  const [error, setError] = useState<string | null>(null);
  const cambiarPassword = useChangeMyPassword();

  function handleClose() {
    setForm(ESTADO_INICIAL);
    setError(null);
    setOpen(false);
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);

    if (form.newPassword.length < 6) {
      setError("La contraseña nueva debe tener al menos 6 caracteres");
      return;
    }
    if (form.newPassword !== form.confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    try {
      await cambiarPassword.mutateAsync({ currentPassword: form.currentPassword, newPassword: form.newPassword });
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo cambiar la contraseña");
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => (v ? setOpen(true) : handleClose())}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <KeyRound className="size-4" />
          Cambiar contraseña
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Cambiar contraseña</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="currentPassword">Contraseña actual</Label>
            <Input
              id="currentPassword"
              type="password"
              required
              value={form.currentPassword}
              onChange={(e) => setForm((p) => ({ ...p, currentPassword: e.target.value }))}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="newPassword">Contraseña nueva</Label>
            <Input
              id="newPassword"
              type="password"
              required
              minLength={6}
              value={form.newPassword}
              onChange={(e) => setForm((p) => ({ ...p, newPassword: e.target.value }))}
              placeholder="Mínimo 6 caracteres"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="confirmPassword">Confirmar contraseña nueva</Label>
            <Input
              id="confirmPassword"
              type="password"
              required
              value={form.confirmPassword}
              onChange={(e) => setForm((p) => ({ ...p, confirmPassword: e.target.value }))}
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={cambiarPassword.isPending}>
              {cambiarPassword.isPending && <Loader2 className="size-4 animate-spin" />}
              Guardar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
