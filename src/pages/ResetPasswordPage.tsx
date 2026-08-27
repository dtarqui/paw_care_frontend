import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authApi } from "@/features/auth/api";
import { ApiError } from "@/lib/api-client";
import { CheckCircle2, KeyRound, Loader2 } from "lucide-react";
import { LanguageToggle } from "@/components/LanguageToggle";
import { useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { Link, useSearchParams } from "react-router-dom";

export function ResetPasswordPage() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);

    if (newPassword.length < 6) {
      setError(t("auth.passwordTooShort"));
      return;
    }
    if (newPassword !== confirmPassword) {
      setError(t("auth.passwordsDoNotMatch"));
      return;
    }

    setIsSubmitting(true);
    try {
      await authApi.resetWithToken(token, newPassword);
      setDone(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t("auth.resetError"));
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
            {done ? <CheckCircle2 className="size-6 text-primary" /> : <KeyRound className="size-6 text-primary" />}
          </div>
          <CardTitle className="text-xl">{done ? t("reset.done") : t("reset.title")}</CardTitle>
          {!done && !token && <CardDescription className="text-destructive">{t("reset.invalidLink")}</CardDescription>}
        </CardHeader>
        <CardContent>
          {done ? (
            <>
              <p className="text-center text-sm text-muted-foreground">{t("reset.doneHint")}</p>
              <Button asChild className="mt-4 w-full">
                <Link to="/login">{t("reset.goToLogin")}</Link>
              </Button>
            </>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="newPassword">{t("auth.newPassword")}</Label>
                <Input
                  id="newPassword"
                  type="password"
                  required
                  minLength={6}
                  autoFocus
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder={t("auth.minSixCharacters")}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="confirmPassword">{t("auth.confirmPassword")}</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              {error && (
                <p role="alert" className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {error}
                </p>
              )}

              <Button type="submit" disabled={isSubmitting || !token} className="mt-2">
                {isSubmitting && <Loader2 className="size-4 animate-spin" />}
                {t("users.resetPassword")}
              </Button>

              <Link to="/forgot-password" className="text-center text-sm text-muted-foreground hover:text-foreground">
                {t("reset.requestNewLink")}
              </Link>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
