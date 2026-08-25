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
import { ROLES } from "@/lib/roles";
import { Loader2 } from "lucide-react";
import { useState, type FormEvent } from "react";

export function ChangeRoleDialog({ user, onClose }: { user: User | null; onClose: () => void }) {
  const [rol, setRol] = useState<Role | "">("");
  const [matricula, setMatricula] = useState("");
  const [especialidad, setEspecialidad] = useState("");
  const [error, setError] = useState<string | null>(null);
  const cambiarRol = useChangeUserRole();

  const rolElegido = rol || user?.role || "";
  const requiereDatosVeterinario = rolElegido === "VET" && user?.role !== "VET";

  function limpiarYCerrar() {
    setRol("");
    setMatricula("");
    setEspecialidad("");
    setError(null);
    onClose();
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    if (!user || !rolElegido) return;
    if (requiereDatosVeterinario && (!matricula || !especialidad)) {
      setError("Matrícula y especialidad son obligatorias para convertir a Veterinario");
      return;
    }
    try {
      await cambiarRol.mutateAsync({
        id: user.id,
        input: { role: rolElegido as Role, licenseNumber: matricula || undefined, specialty: especialidad || undefined },
      });
      limpiarYCerrar();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo cambiar el rol");
    }
  }

  return (
    <Dialog open={!!user} onOpenChange={(v) => !v && limpiarYCerrar()}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Cambiar rol</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <p className="text-sm text-muted-foreground">
            {user?.firstName} {user?.paternalLastName} — rol actual: {user?.role}
          </p>

          <div className="flex flex-col gap-1.5">
            <Label>Nuevo rol</Label>
            <Select value={rolElegido} onValueChange={(v) => setRol(v as Role)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecciona un rol" />
              </SelectTrigger>
              <SelectContent>
                {ROLES.map((r) => (
                  <SelectItem key={r.value} value={r.value}>
                    {r.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {requiereDatosVeterinario && (
            <div className="flex flex-col gap-3 rounded-md border bg-muted/40 p-3">
              <div className="text-xs font-medium text-muted-foreground">Datos profesionales (obligatorios para veterinario)</div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="licenseNumber">Matrícula *</Label>
                <Input id="licenseNumber" value={matricula} onChange={(e) => setMatricula(e.target.value)} placeholder="VET-0XX" />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="specialty">Especialidad *</Label>
                <Input id="specialty" value={especialidad} onChange={(e) => setEspecialidad(e.target.value)} />
              </div>
            </div>
          )}

          {error && <p className="text-sm text-destructive">{error}</p>}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={limpiarYCerrar}>
              Cancelar
            </Button>
            <Button type="submit" disabled={cambiarRol.isPending || !rolElegido || rolElegido === user?.role}>
              {cambiarRol.isPending && <Loader2 className="size-4 animate-spin" />}
              Guardar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
