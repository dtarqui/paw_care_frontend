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
import { ROLES } from "@/lib/roles";
import { Loader2, UserPlus } from "lucide-react";
import { useState, type FormEvent } from "react";

const ESTADO_INICIAL = {
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
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(ESTADO_INICIAL);
  const [error, setError] = useState<string | null>(null);
  const crearUsuario = useCreateUser();

  const esVeterinario = form.role === "VET";

  function actualizar<K extends keyof typeof ESTADO_INICIAL>(field: K, valor: (typeof ESTADO_INICIAL)[K]) {
    setForm((prev) => ({ ...prev, [field]: valor }));
  }

  function handleClose() {
    setForm(ESTADO_INICIAL);
    setError(null);
    setOpen(false);
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);

    if (!form.role) {
      setError("Selecciona un rol");
      return;
    }
    if (form.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }
    if (esVeterinario && (!form.licenseNumber || !form.specialty)) {
      setError("Matrícula y especialidad son obligatorias para un Veterinario");
      return;
    }

    try {
      await crearUsuario.mutateAsync({
        firstName: form.firstName,
        paternalLastName: form.paternalLastName,
        maternalLastName: form.maternalLastName || undefined,
        nationalId: form.nationalId,
        email: form.email || undefined,
        phone: form.phone || undefined,
        username: form.username,
        role: form.role,
        password: form.password,
        licenseNumber: esVeterinario ? form.licenseNumber : undefined,
        specialty: esVeterinario ? form.specialty : undefined,
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
          Nuevo usuario
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
              <Label htmlFor="firstName">Nombre *</Label>
              <Input id="firstName" required value={form.firstName} onChange={(e) => actualizar("firstName", e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="paternalLastName">Apellido paterno *</Label>
              <Input
                id="paternalLastName"
                required
                value={form.paternalLastName}
                onChange={(e) => actualizar("paternalLastName", e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="maternalLastName">Apellido materno</Label>
              <Input
                id="maternalLastName"
                value={form.maternalLastName}
                onChange={(e) => actualizar("maternalLastName", e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="nationalId">CI *</Label>
              <Input id="nationalId" required value={form.nationalId} onChange={(e) => actualizar("nationalId", e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={form.email} onChange={(e) => actualizar("email", e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="phone">Teléfono</Label>
              <Input id="phone" value={form.phone} onChange={(e) => actualizar("phone", e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Rol *</Label>
              <Select value={form.role} onValueChange={(v) => actualizar("role", v as Role)}>
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
                Datos profesionales (solo Vet)
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="licenseNumber">Matrícula *</Label>
                <Input
                  id="licenseNumber"
                  required={esVeterinario}
                  value={form.licenseNumber}
                  onChange={(e) => actualizar("licenseNumber", e.target.value)}
                  placeholder="VET-0XX"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="specialty">Especialidad *</Label>
                <Input
                  id="specialty"
                  required={esVeterinario}
                  value={form.specialty}
                  onChange={(e) => actualizar("specialty", e.target.value)}
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
              <Label htmlFor="confirmPassword">Confirmar contraseña *</Label>
              <Input
                id="confirmPassword"
                type="password"
                required
                value={form.confirmPassword}
                onChange={(e) => actualizar("confirmPassword", e.target.value)}
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
              Registrar User
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
