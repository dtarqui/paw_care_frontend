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
import type { Rol } from "@/features/auth/types";
import { useCrearUsuario } from "@/features/usuarios/useUsuarios";
import { ROLES } from "@/lib/roles";
import { Loader2, UserPlus } from "lucide-react";
import { useState, type FormEvent } from "react";

const ESTADO_INICIAL = {
  nombre: "",
  apellidoPaterno: "",
  apellidoMaterno: "",
  ci: "",
  email: "",
  telefono: "",
  username: "",
  rol: "" as Rol | "",
  password: "",
  confirmarPassword: "",
  matricula: "",
  especialidad: "",
};

export function NuevoUsuarioDialog() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(ESTADO_INICIAL);
  const [error, setError] = useState<string | null>(null);
  const crearUsuario = useCrearUsuario();

  const esVeterinario = form.rol === "VETERINARIO";

  function actualizar<K extends keyof typeof ESTADO_INICIAL>(campo: K, valor: (typeof ESTADO_INICIAL)[K]) {
    setForm((prev) => ({ ...prev, [campo]: valor }));
  }

  function handleClose() {
    setForm(ESTADO_INICIAL);
    setError(null);
    setOpen(false);
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);

    if (!form.rol) {
      setError("Selecciona un rol");
      return;
    }
    if (form.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }
    if (form.password !== form.confirmarPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }
    if (esVeterinario && (!form.matricula || !form.especialidad)) {
      setError("Matrícula y especialidad son obligatorias para un Veterinario");
      return;
    }

    try {
      await crearUsuario.mutateAsync({
        nombre: form.nombre,
        apellidoPaterno: form.apellidoPaterno,
        apellidoMaterno: form.apellidoMaterno || undefined,
        ci: form.ci,
        email: form.email || undefined,
        telefono: form.telefono || undefined,
        username: form.username,
        rol: form.rol,
        password: form.password,
        matricula: esVeterinario ? form.matricula : undefined,
        especialidad: esVeterinario ? form.especialidad : undefined,
      });
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo registrar el usuario");
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => (v ? setOpen(true) : handleClose())}>
      <DialogTrigger asChild>
        <Button>
          <UserPlus className="size-4" />
          Nuevo Usuario
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-xl overflow-hidden">
        <DialogHeader>
          <DialogTitle>Nuevo usuario</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col gap-4">
          <div className="-mx-1 flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-1 py-0.5">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="nombre">Nombre *</Label>
              <Input id="nombre" required value={form.nombre} onChange={(e) => actualizar("nombre", e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="apellidoPaterno">Apellido paterno *</Label>
              <Input
                id="apellidoPaterno"
                required
                value={form.apellidoPaterno}
                onChange={(e) => actualizar("apellidoPaterno", e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="apellidoMaterno">Apellido materno</Label>
              <Input
                id="apellidoMaterno"
                value={form.apellidoMaterno}
                onChange={(e) => actualizar("apellidoMaterno", e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="ci">CI *</Label>
              <Input id="ci" required value={form.ci} onChange={(e) => actualizar("ci", e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={form.email} onChange={(e) => actualizar("email", e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="telefono">Teléfono</Label>
              <Input id="telefono" value={form.telefono} onChange={(e) => actualizar("telefono", e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Rol *</Label>
              <Select value={form.rol} onValueChange={(v) => actualizar("rol", v as Rol)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Seleccione rol" />
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
          </div>

          {esVeterinario && (
            <div className="grid grid-cols-2 gap-3 rounded-md border bg-muted/40 p-3">
              <div className="col-span-2 text-xs font-medium text-muted-foreground">
                Datos profesionales (solo Veterinario)
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="matricula">Matrícula *</Label>
                <Input
                  id="matricula"
                  required={esVeterinario}
                  value={form.matricula}
                  onChange={(e) => actualizar("matricula", e.target.value)}
                  placeholder="VET-0XX"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="especialidad">Especialidad *</Label>
                <Input
                  id="especialidad"
                  required={esVeterinario}
                  value={form.especialidad}
                  onChange={(e) => actualizar("especialidad", e.target.value)}
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="username">Usuario *</Label>
              <Input id="username" required value={form.username} onChange={(e) => actualizar("username", e.target.value)} />
            </div>
            <div />
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="password">Contraseña *</Label>
              <Input
                id="password"
                type="password"
                required
                minLength={6}
                value={form.password}
                onChange={(e) => actualizar("password", e.target.value)}
                placeholder="Mínimo 6 caracteres"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="confirmarPassword">Confirmar contraseña *</Label>
              <Input
                id="confirmarPassword"
                type="password"
                required
                value={form.confirmarPassword}
                onChange={(e) => actualizar("confirmarPassword", e.target.value)}
              />
            </div>
          </div>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={crearUsuario.isPending}>
              {crearUsuario.isPending && <Loader2 className="size-4 animate-spin" />}
              Registrar Usuario
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
