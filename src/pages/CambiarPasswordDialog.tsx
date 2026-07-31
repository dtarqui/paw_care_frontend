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
import { useCambiarMiPassword } from "@/features/usuarios/useUsuarios";
import { KeyRound, Loader2 } from "lucide-react";
import { useState, type FormEvent } from "react";

const ESTADO_INICIAL = { passwordActual: "", passwordNuevo: "", confirmarPassword: "" };

export function CambiarPasswordDialog() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(ESTADO_INICIAL);
  const [error, setError] = useState<string | null>(null);
  const cambiarPassword = useCambiarMiPassword();

  function handleClose() {
    setForm(ESTADO_INICIAL);
    setError(null);
    setOpen(false);
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);

    if (form.passwordNuevo.length < 6) {
      setError("La contraseña nueva debe tener al menos 6 caracteres");
      return;
    }
    if (form.passwordNuevo !== form.confirmarPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    try {
      await cambiarPassword.mutateAsync({ passwordActual: form.passwordActual, passwordNuevo: form.passwordNuevo });
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
            <Label htmlFor="passwordActual">Contraseña actual</Label>
            <Input
              id="passwordActual"
              type="password"
              required
              value={form.passwordActual}
              onChange={(e) => setForm((p) => ({ ...p, passwordActual: e.target.value }))}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="passwordNuevo">Contraseña nueva</Label>
            <Input
              id="passwordNuevo"
              type="password"
              required
              minLength={6}
              value={form.passwordNuevo}
              onChange={(e) => setForm((p) => ({ ...p, passwordNuevo: e.target.value }))}
              placeholder="Mínimo 6 caracteres"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="confirmarPassword">Confirmar contraseña nueva</Label>
            <Input
              id="confirmarPassword"
              type="password"
              required
              value={form.confirmarPassword}
              onChange={(e) => setForm((p) => ({ ...p, confirmarPassword: e.target.value }))}
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
