import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authApi } from "@/features/auth/api";
import { ApiError } from "@/lib/api-client";
import { ArrowLeft, KeyRound, Loader2, MailCheck } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";

export function ForgotPasswordPage() {
  const [username, setUsername] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await authApi.requestPasswordRecovery(username);
      setSent(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "No se pudo procesar la solicitud");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-svh items-center justify-center bg-gradient-to-b from-muted/60 to-muted/20 p-4">
      <Card className="w-full max-w-sm shadow-lg">
        <CardHeader className="items-center text-center">
          <div className="mb-2 flex size-12 items-center justify-center rounded-full bg-primary/10">
            {sent ? <MailCheck className="size-6 text-primary" /> : <KeyRound className="size-6 text-primary" />}
          </div>
          <CardTitle className="text-xl">Recuperar contraseña</CardTitle>
          {!sent && <CardDescription>Ingresa tu usuario y te enviamos un enlace a tu email registrado</CardDescription>}
        </CardHeader>
        <CardContent>
          {sent ? (
            <p className="text-center text-sm text-muted-foreground">
              Si la cuenta existe y tiene un email registrado, te enviamos un enlace de recuperación — revisa tu bandeja
              (y la carpeta de spam). El enlace vence en 1 hora.
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="username">Usuario</Label>
                <Input id="username" required autoFocus value={username} onChange={(e) => setUsername(e.target.value)} />
              </div>

              {error && (
                <p role="alert" className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {error}
                </p>
              )}

              <Button type="submit" disabled={isSubmitting} className="mt-2">
                {isSubmitting && <Loader2 className="size-4 animate-spin" />}
                Enviar enlace de recuperación
              </Button>
            </form>
          )}

          <Link to="/login" className="mt-4 flex items-center justify-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="size-4" />
            Volver a inicio de sesión
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
