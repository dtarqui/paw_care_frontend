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
import type { Rol } from "@/features/auth/types";
import type { Usuario } from "@/features/usuarios/types";
import { useCambiarRolUsuario } from "@/features/usuarios/useUsuarios";
import { ROLES } from "@/lib/roles";
import { Loader2 } from "lucide-react";
import { useState, type FormEvent } from "react";

export function CambiarRolDialog({ usuario, onClose }: { usuario: Usuario | null; onClose: () => void }) {
  const [rol, setRol] = useState<Rol | "">("");
  const [matricula, setMatricula] = useState("");
  const [especialidad, setEspecialidad] = useState("");
  const [error, setError] = useState<string | null>(null);
  const cambiarRol = useCambiarRolUsuario();

  const rolElegido = rol || usuario?.rol || "";
  const requiereDatosVeterinario = rolElegido === "VETERINARIO" && usuario?.rol !== "VETERINARIO";

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
    if (!usuario || !rolElegido) return;
    if (requiereDatosVeterinario && (!matricula || !especialidad)) {
      setError("Matrícula y especialidad son obligatorias para convertir a Veterinario");
      return;
    }
    try {
      await cambiarRol.mutateAsync({
        id: usuario.id,
        input: { rol: rolElegido as Rol, matricula: matricula || undefined, especialidad: especialidad || undefined },
      });
      limpiarYCerrar();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo cambiar el rol");
    }
  }

  return (
    <Dialog open={!!usuario} onOpenChange={(v) => !v && limpiarYCerrar()}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Cambiar rol</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <p className="text-sm text-muted-foreground">
            {usuario?.nombre} {usuario?.apellidoPaterno} — rol actual: {usuario?.rol}
          </p>

          <div className="flex flex-col gap-1.5">
            <Label>Nuevo rol</Label>
            <Select value={rolElegido} onValueChange={(v) => setRol(v as Rol)}>
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
              <div className="text-xs font-medium text-muted-foreground">Datos profesionales (obligatorios para Veterinario)</div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="matricula">Matrícula *</Label>
                <Input id="matricula" value={matricula} onChange={(e) => setMatricula(e.target.value)} placeholder="VET-0XX" />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="especialidad">Especialidad *</Label>
                <Input id="especialidad" value={especialidad} onChange={(e) => setEspecialidad(e.target.value)} />
              </div>
            </div>
          )}

          {error && <p className="text-sm text-destructive">{error}</p>}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={limpiarYCerrar}>
              Cancelar
            </Button>
            <Button type="submit" disabled={cambiarRol.isPending || !rolElegido || rolElegido === usuario?.rol}>
              {cambiarRol.isPending && <Loader2 className="size-4 animate-spin" />}
              Guardar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
