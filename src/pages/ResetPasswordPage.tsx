import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authApi } from "@/features/auth/api";
import { ApiError } from "@/lib/api-client";
import { CheckCircle2, KeyRound, Loader2 } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Link, useSearchParams } from "react-router-dom";

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [newPassword, setPasswordNuevo] = useState("");
  const [confirmPassword, setConfirmarPassword] = useState("");
  const [hecho, setHecho] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);

    if (newPassword.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    setIsSubmitting(true);
    try {
      await authApi.resetWithToken(token, newPassword);
      setHecho(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "No se pudo restablecer la contraseña");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-svh items-center justify-center bg-gradient-to-b from-muted/60 to-muted/20 p-4">
      <Card className="w-full max-w-sm shadow-lg">
        <CardHeader className="items-center text-center">
          <div className="mb-2 flex size-12 items-center justify-center rounded-full bg-primary/10">
            {hecho ? <CheckCircle2 className="size-6 text-primary" /> : <KeyRound className="size-6 text-primary" />}
          </div>
          <CardTitle className="text-xl">{hecho ? "Contraseña actualizada" : "Elige tu nueva contraseña"}</CardTitle>
          {!hecho && !token && <CardDescription className="text-destructive">Este enlace no incluye un token válido</CardDescription>}
        </CardHeader>
        <CardContent>
          {hecho ? (
            <>
              <p className="text-center text-sm text-muted-foreground">Ya puedes iniciar sesión con tu nueva contraseña.</p>
              <Button asChild className="mt-4 w-full">
                <Link to="/login">Ir a inicio de sesión</Link>
              </Button>
            </>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="newPassword">Contraseña nueva</Label>
                <Input
                  id="newPassword"
                  type="password"
                  required
                  minLength={6}
                  autoFocus
                  value={newPassword}
                  onChange={(e) => setPasswordNuevo(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmarPassword(e.target.value)}
                />
              </div>

              {error && (
                <p role="alert" className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {error}
                </p>
              )}

              <Button type="submit" disabled={isSubmitting || !token} className="mt-2">
                {isSubmitting && <Loader2 className="size-4 animate-spin" />}
                Restablecer contraseña
              </Button>

              <Link to="/forgot-password" className="text-center text-sm text-muted-foreground hover:text-foreground">
                Pedir un enlace nuevo
              </Link>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
