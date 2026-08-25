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
import { useInviteVet } from "@/features/users/useUsers";
import { Loader2, Mail } from "lucide-react";
import { useState, type FormEvent } from "react";

export function InviteVetDialog() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [nombre, setNombre] = useState("");
  const [error, setError] = useState<string | null>(null);
  const invitar = useInviteVet();

  function handleClose() {
    setEmail("");
    setNombre("");
    setError(null);
    setOpen(false);
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    try {
      await invitar.mutateAsync({ email, name: nombre || undefined });
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo enviar la invitación");
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => (v ? setOpen(true) : handleClose())}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Mail className="size-4" />
          Invitar veterinario
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Invitar veterinario</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <p className="text-sm text-muted-foreground">
            Le enviamos un email con un enlace para que complete su registro — la cuenta queda activa apenas ponga su
            contraseña, sin necesitar aprobación adicional.
          </p>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="inv-email">Email *</Label>
            <Input id="inv-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="inv-nombre">Nombre (opcional)</Label>
            <Input id="inv-nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Para personalizar el email" />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={invitar.isPending}>
              {invitar.isPending && <Loader2 className="size-4 animate-spin" />}
              Enviar invitación
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
