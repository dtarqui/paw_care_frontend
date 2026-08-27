import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useAcceptInvitation, useValidateInvitation } from "@/features/users/useUsers";
import { ApiError } from "@/lib/api-client";
import { AlertTriangle, ArrowLeft, CheckCircle2, Eye, EyeOff, Loader2, Mail } from "lucide-react";
import { LanguageToggle } from "@/components/LanguageToggle";
import { useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { Link, useSearchParams } from "react-router-dom";

const INITIAL_STATE = {
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

  const { t } = useTranslation();
  const [form, setForm] = useState(INITIAL_STATE);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [accepted, setAccepted] = useState(false);
  const acceptInvitationMutation = useAcceptInvitation();

  function update<K extends keyof typeof INITIAL_STATE>(field: K, value: (typeof INITIAL_STATE)[K]) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);

    if (form.password.length < 6) {
      setError(t("auth.passwordTooShort"));
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError(t("auth.passwordsDoNotMatch"));
      return;
    }

    try {
      await acceptInvitationMutation.mutateAsync({
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
      setAccepted(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t("invitation.error"));
    }
  }

  if (accepted) {
    return (
      <div className="relative flex min-h-svh items-center justify-center bg-gradient-to-b from-muted/60 to-muted/20 p-4">
      <LanguageToggle className="absolute right-4 top-4" />
        <Card className="w-full max-w-sm shadow-lg">
          <CardContent className="flex flex-col items-center gap-3 py-10 text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400">
              <CheckCircle2 className="size-6" />
            </div>
            <h1 className="text-lg font-semibold">{t("invitation.createdTitle")}</h1>
            <p className="text-sm text-muted-foreground">{t("invitation.createdBody")}</p>
            <Button asChild className="mt-2">
              <Link to="/login">{t("reset.goToLogin")}</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="relative flex min-h-svh items-center justify-center bg-gradient-to-b from-muted/60 to-muted/20 p-4">
      <LanguageToggle className="absolute right-4 top-4" />
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
      <div className="relative flex min-h-svh items-center justify-center bg-gradient-to-b from-muted/60 to-muted/20 p-4">
      <LanguageToggle className="absolute right-4 top-4" />
        <Card className="w-full max-w-sm shadow-lg">
          <CardContent className="flex flex-col items-center gap-3 py-10 text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
              <AlertTriangle className="size-6" />
            </div>
            <h1 className="text-lg font-semibold">{t("invitation.invalidTitle")}</h1>
            <p className="text-sm text-muted-foreground">{t("invitation.invalidBody")}</p>
            <Button asChild variant="outline" className="mt-2">
              <Link to="/login">{t("forgot.backToLogin")}</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-svh items-center justify-center bg-gradient-to-b from-muted/60 to-muted/20 p-4">
      <LanguageToggle className="absolute right-4 top-4" />
      <Card className="w-full max-w-lg shadow-lg">
        <CardHeader className="items-center text-center">
          <div className="mb-2 flex size-12 items-center justify-center rounded-full bg-primary/10">
            <Mail className="size-6 text-primary" />
          </div>
          <CardTitle className="text-xl">{t("invitation.title")}</CardTitle>
          <CardDescription>{t("invitation.description", { email: invitation.email })}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="firstName">{t("people.firstName")} *</Label>
                <Input
                  id="firstName"
                  required
                  value={form.firstName || invitation.name || ""}
                  onChange={(e) => update("firstName", e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="paternalLastName">{t("people.paternalLastName")} *</Label>
                <Input
                  id="paternalLastName"
                  required
                  value={form.paternalLastName}
                  onChange={(e) => update("paternalLastName", e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="maternalLastName">{t("people.maternalLastName")}</Label>
                <Input
                  id="maternalLastName"
                  value={form.maternalLastName}
                  onChange={(e) => update("maternalLastName", e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="nationalId">{t("common.nationalId")} *</Label>
                <Input id="nationalId" required value={form.nationalId} onChange={(e) => update("nationalId", e.target.value)} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="phone">{t("common.phone")}</Label>
                <Input id="phone" value={form.phone} onChange={(e) => update("phone", e.target.value)} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="username">{t("common.username")} *</Label>
                <Input id="username" required value={form.username} onChange={(e) => update("username", e.target.value)} />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 rounded-md border bg-muted/40 p-3 sm:grid-cols-2">
              <div className="col-span-1 sm:col-span-2 text-xs font-medium text-muted-foreground">{t("people.professionalDetails")}</div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="licenseNumber">{t("people.licenseNumber")} *</Label>
                <Input
                  id="licenseNumber"
                  required
                  value={form.licenseNumber}
                  onChange={(e) => update("licenseNumber", e.target.value)}
                  placeholder="VET-0XX"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="specialty">{t("people.specialty")} *</Label>
                <Input
                  id="specialty"
                  required
                  value={form.specialty}
                  onChange={(e) => update("specialty", e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="password">{t("common.password")} *</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={6}
                    value={form.password}
                    onChange={(e) => update("password", e.target.value)}
                    placeholder={t("auth.minSixCharacters")}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    aria-label={showPassword ? t("login.hidePassword") : t("login.showPassword")}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="confirmPassword">{t("auth.confirmPassword")} *</Label>
                <Input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  required
                  value={form.confirmPassword}
                  onChange={(e) => update("confirmPassword", e.target.value)}
                />
              </div>
            </div>

            {error && (
              <p role="alert" className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {error}
              </p>
            )}

            <Button type="submit" disabled={acceptInvitationMutation.isPending} className="mt-2">
              {acceptInvitationMutation.isPending && <Loader2 className="size-4 animate-spin" />}
              Completar log
            </Button>
          </form>

          <Link to="/login" className="mt-4 flex items-center justify-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="size-4" />
            {t("forgot.backToLogin")}
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
