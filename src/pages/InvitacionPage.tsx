import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useAceptarInvitacion, useValidarInvitacion } from "@/features/usuarios/useUsuarios";
import { ApiError } from "@/lib/api-client";
import { AlertTriangle, ArrowLeft, CheckCircle2, Eye, EyeOff, Loader2, Mail } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Link, useSearchParams } from "react-router-dom";

const ESTADO_INICIAL = {
  nombre: "",
  apellidoPaterno: "",
  apellidoMaterno: "",
  ci: "",
  telefono: "",
  username: "",
  password: "",
  confirmarPassword: "",
  matricula: "",
  especialidad: "",
};

export function InvitacionPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") ?? undefined;
  const { data: invitacion, isLoading, isError } = useValidarInvitacion(token);

  const [form, setForm] = useState(ESTADO_INICIAL);
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [aceptado, setAceptado] = useState(false);
  const aceptar = useAceptarInvitacion();

  function actualizar<K extends keyof typeof ESTADO_INICIAL>(campo: K, valor: (typeof ESTADO_INICIAL)[K]) {
    setForm((prev) => ({ ...prev, [campo]: valor }));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);

    if (form.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }
    if (form.password !== form.confirmarPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    try {
      await aceptar.mutateAsync({
        token: token!,
        input: {
          nombre: form.nombre || invitacion?.nombre || "",
          apellidoPaterno: form.apellidoPaterno,
          apellidoMaterno: form.apellidoMaterno || undefined,
          ci: form.ci,
          telefono: form.telefono || undefined,
          username: form.username,
          password: form.password,
          matricula: form.matricula,
          especialidad: form.especialidad,
        },
      });
      setAceptado(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "No se pudo completar el registro");
    }
  }

  if (aceptado) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-gradient-to-b from-muted/60 to-muted/20 p-4">
        <Card className="w-full max-w-sm shadow-lg">
          <CardContent className="flex flex-col items-center gap-3 py-10 text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400">
              <CheckCircle2 className="size-6" />
            </div>
            <h1 className="text-lg font-semibold">¡Cuenta creada!</h1>
            <p className="text-sm text-muted-foreground">Ya puedes iniciar sesión con tu usuario y contraseña.</p>
            <Button asChild className="mt-2">
              <Link to="/login">Ir a inicio de sesión</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-gradient-to-b from-muted/60 to-muted/20 p-4">
        <Card className="w-full max-w-lg shadow-lg">
          <CardContent className="flex flex-col gap-3 py-10">
            <Skeleton className="mx-auto h-12 w-12 rounded-full" />
            <Skeleton className="mx-auto h-4 w-48" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!token || isError || !invitacion) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-gradient-to-b from-muted/60 to-muted/20 p-4">
        <Card className="w-full max-w-sm shadow-lg">
          <CardContent className="flex flex-col items-center gap-3 py-10 text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
              <AlertTriangle className="size-6" />
            </div>
            <h1 className="text-lg font-semibold">Invitación no válida</h1>
            <p className="text-sm text-muted-foreground">Este enlace no es válido, ya se usó, o expiró. Pide que te envíen una invitación nueva.</p>
            <Button asChild variant="outline" className="mt-2">
              <Link to="/login">Volver a inicio de sesión</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-svh items-center justify-center bg-gradient-to-b from-muted/60 to-muted/20 p-4">
      <Card className="w-full max-w-lg shadow-lg">
        <CardHeader className="items-center text-center">
          <div className="mb-2 flex size-12 items-center justify-center rounded-full bg-primary/10">
            <Mail className="size-6 text-primary" />
          </div>
          <CardTitle className="text-xl">Completa tu registro</CardTitle>
          <CardDescription>Te invitaron a PawCare como Veterinario — {invitacion.email}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="nombre">Nombre *</Label>
                <Input
                  id="nombre"
                  required
                  value={form.nombre || invitacion.nombre || ""}
                  onChange={(e) => actualizar("nombre", e.target.value)}
                />
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
                <Label htmlFor="telefono">Teléfono</Label>
                <Input id="telefono" value={form.telefono} onChange={(e) => actualizar("telefono", e.target.value)} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="username">Usuario *</Label>
                <Input id="username" required value={form.username} onChange={(e) => actualizar("username", e.target.value)} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 rounded-md border bg-muted/40 p-3">
              <div className="col-span-2 text-xs font-medium text-muted-foreground">Datos profesionales</div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="matricula">Matrícula *</Label>
                <Input
                  id="matricula"
                  required
                  value={form.matricula}
                  onChange={(e) => actualizar("matricula", e.target.value)}
                  placeholder="VET-0XX"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="especialidad">Especialidad *</Label>
                <Input
                  id="especialidad"
                  required
                  value={form.especialidad}
                  onChange={(e) => actualizar("especialidad", e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="password">Contraseña *</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={mostrarPassword ? "text" : "password"}
                    required
                    minLength={6}
                    value={form.password}
                    onChange={(e) => actualizar("password", e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setMostrarPassword((v) => !v)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    aria-label={mostrarPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                    tabIndex={-1}
                  >
                    {mostrarPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="confirmarPassword">Confirmar contraseña *</Label>
                <Input
                  id="confirmarPassword"
                  type={mostrarPassword ? "text" : "password"}
                  required
                  value={form.confirmarPassword}
                  onChange={(e) => actualizar("confirmarPassword", e.target.value)}
                />
              </div>
            </div>

            {error && (
              <p role="alert" className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {error}
              </p>
            )}

            <Button type="submit" disabled={aceptar.isPending} className="mt-2">
              {aceptar.isPending && <Loader2 className="size-4 animate-spin" />}
              Completar registro
            </Button>
          </form>

          <Link to="/login" className="mt-4 flex items-center justify-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="size-4" />
            Volver a inicio de sesión
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
