import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useAcceptInvitation, useValidateInvitation } from "@/features/users/useUsers";
import { ApiError } from "@/lib/api-client";
import { AlertTriangle, ArrowLeft, CheckCircle2, Eye, EyeOff, Loader2, Mail } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Link, useSearchParams } from "react-router-dom";

const ESTADO_INICIAL = {
  firstName: "",
  paternalLastName: "",
  maternalLastName: "",
  nationalId: "",
  phone: "",
  username: "",
  password: "",
  confirmPassword: "",
  licenseNumber: "",
  specialty: "",
};

export function InvitationPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") ?? undefined;
  const { data: invitation, isLoading, isError } = useValidateInvitation(token);

  const [form, setForm] = useState(ESTADO_INICIAL);
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [aceptado, setAceptado] = useState(false);
  const aceptar = useAcceptInvitation();

  function actualizar<K extends keyof typeof ESTADO_INICIAL>(field: K, valor: (typeof ESTADO_INICIAL)[K]) {
    setForm((prev) => ({ ...prev, [field]: valor }));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);

    if (form.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    try {
      await aceptar.mutateAsync({
        token: token!,
        input: {
          firstName: form.firstName || invitation?.name || "",
          paternalLastName: form.paternalLastName,
          maternalLastName: form.maternalLastName || undefined,
          nationalId: form.nationalId,
          phone: form.phone || undefined,
          username: form.username,
          password: form.password,
          licenseNumber: form.licenseNumber,
          specialty: form.specialty,
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

  if (!token || isError || !invitation) {
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
          <CardDescription>Te invitaron a PawCare como Vet — {invitation.email}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="firstName">Nombre *</Label>
                <Input
                  id="firstName"
                  required
                  value={form.firstName || invitation.name || ""}
                  onChange={(e) => actualizar("firstName", e.target.value)}
                />
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
                <Label htmlFor="phone">Teléfono</Label>
                <Input id="phone" value={form.phone} onChange={(e) => actualizar("phone", e.target.value)} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="username">User *</Label>
                <Input id="username" required value={form.username} onChange={(e) => actualizar("username", e.target.value)} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 rounded-md border bg-muted/40 p-3">
              <div className="col-span-2 text-xs font-medium text-muted-foreground">Datos profesionales</div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="licenseNumber">Matrícula *</Label>
                <Input
                  id="licenseNumber"
                  required
                  value={form.licenseNumber}
                  onChange={(e) => actualizar("licenseNumber", e.target.value)}
                  placeholder="VET-0XX"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="specialty">Especialidad *</Label>
                <Input
                  id="specialty"
                  required
                  value={form.specialty}
                  onChange={(e) => actualizar("specialty", e.target.value)}
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
                <Label htmlFor="confirmPassword">Confirmar contraseña *</Label>
                <Input
                  id="confirmPassword"
                  type={mostrarPassword ? "text" : "password"}
                  required
                  value={form.confirmPassword}
                  onChange={(e) => actualizar("confirmPassword", e.target.value)}
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
              Completar log
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
