import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authApi } from "@/features/auth/api";
import { ApiError } from "@/lib/api-client";
import { ArrowLeft, KeyRound, Loader2, MailCheck } from "lucide-react";
import { LanguageToggle } from "@/components/LanguageToggle";
import { useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export function ForgotPasswordPage() {
  const { t } = useTranslation();
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
      setError(err instanceof ApiError ? err.message : t("forgot.error"));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="relative flex min-h-svh items-center justify-center bg-gradient-to-b from-muted/60 to-muted/20 p-4">
      <LanguageToggle className="absolute right-4 top-4" />
      <Card className="w-full max-w-sm shadow-lg">
        <CardHeader className="items-center text-center">
          <div className="mb-2 flex size-12 items-center justify-center rounded-full bg-primary/10">
            {sent ? <MailCheck className="size-6 text-primary" /> : <KeyRound className="size-6 text-primary" />}
          </div>
          <CardTitle className="text-xl">{t("forgot.title")}</CardTitle>
          {!sent && <CardDescription>{t("forgot.description")}</CardDescription>}
        </CardHeader>
        <CardContent>
          {sent ? (
            <p className="text-center text-sm text-muted-foreground">
              {t("forgot.sent")}
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="username">{t("common.username")}</Label>
                <Input id="username" required autoFocus value={username} onChange={(e) => setUsername(e.target.value)} />
              </div>

              {error && (
                <p role="alert" className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {error}
                </p>
              )}

              <Button type="submit" disabled={isSubmitting} className="mt-2">
                {isSubmitting && <Loader2 className="size-4 animate-spin" />}
                {t("forgot.send")}
              </Button>
            </form>
          )}

          <Link to="/login" className="mt-4 flex items-center justify-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="size-4" />
            {t("forgot.backToLogin")}
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
