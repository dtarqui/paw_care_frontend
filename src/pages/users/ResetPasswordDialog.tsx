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
import type { User } from "@/features/users/types";
import { useResetPassword } from "@/features/users/useUsers";
import { Loader2 } from "lucide-react";
import { useState, type FormEvent } from "react";

export function ResetPasswordDialog({ user, onClose }: { user: User | null; onClose: () => void }) {
  const [newPassword, setPasswordNuevo] = useState("");
  const [error, setError] = useState<string | null>(null);
  const restablecer = useResetPassword();

  function limpiarYCerrar() {
    setPasswordNuevo("");
    setError(null);
    onClose();
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    if (!user) return;
    if (newPassword.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }
    try {
      await restablecer.mutateAsync({ id: user.id, newPassword });
      limpiarYCerrar();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo restablecer la contraseña");
    }
  }

  return (
    <Dialog open={!!user} onOpenChange={(v) => !v && limpiarYCerrar()}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Restablecer contraseña</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <p className="text-sm text-muted-foreground">
            Se le asignará una contraseña nueva a {user?.firstName} {user?.paternalLastName} ({user?.username}).
            Comunícasela directamente — no se envía por email ni SMS.
          </p>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="newPassword">Contraseña nueva</Label>
            <Input
              id="newPassword"
              type="text"
              minLength={6}
              value={newPassword}
              onChange={(e) => setPasswordNuevo(e.target.value)}
              placeholder="Mínimo 6 caracteres"
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={limpiarYCerrar}>
              Cancelar
            </Button>
            <Button type="submit" disabled={restablecer.isPending}>
              {restablecer.isPending && <Loader2 className="size-4 animate-spin" />}
              Restablecer
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
