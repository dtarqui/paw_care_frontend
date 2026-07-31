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
import type { Usuario } from "@/features/usuarios/types";
import { useRestablecerPassword } from "@/features/usuarios/useUsuarios";
import { Loader2 } from "lucide-react";
import { useState, type FormEvent } from "react";

export function RestablecerPasswordDialog({ usuario, onClose }: { usuario: Usuario | null; onClose: () => void }) {
  const [passwordNuevo, setPasswordNuevo] = useState("");
  const [error, setError] = useState<string | null>(null);
  const restablecer = useRestablecerPassword();

  function limpiarYCerrar() {
    setPasswordNuevo("");
    setError(null);
    onClose();
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    if (!usuario) return;
    if (passwordNuevo.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }
    try {
      await restablecer.mutateAsync({ id: usuario.id, passwordNuevo });
      limpiarYCerrar();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo restablecer la contraseña");
    }
  }

  return (
    <Dialog open={!!usuario} onOpenChange={(v) => !v && limpiarYCerrar()}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Restablecer contraseña</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <p className="text-sm text-muted-foreground">
            Se le asignará una contraseña nueva a {usuario?.nombre} {usuario?.apellidoPaterno} ({usuario?.username}).
            Comunícasela directamente — no se envía por email ni SMS.
          </p>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="passwordNuevo">Contraseña nueva</Label>
            <Input
              id="passwordNuevo"
              type="text"
              minLength={6}
              value={passwordNuevo}
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
