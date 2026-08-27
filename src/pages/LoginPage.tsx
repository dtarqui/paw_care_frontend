import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useAuth } from "@/features/auth/AuthContext";
import { ApiError } from "@/lib/api-client";
import { cn } from "@/lib/utils";
import {
  AlertCircle,
  CalendarClock,
  Eye,
  EyeOff,
  HelpCircle,
  Loader2,
  LockKeyhole,
  PawPrint,
  Stethoscope,
  Package,
} from "lucide-react";
import { LanguageToggle } from "@/components/LanguageToggle";
import { useState, type FormEvent, type KeyboardEvent } from "react";
import { useTranslation } from "react-i18next";
import type { TFunction } from "i18next";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";

/** Lo que el panel de marca cuenta del producto — tres capacidades reales, no relleno.
 * El texto vive en `login.highlights.*`; acá solo el ícono y el orden. */
const HIGHLIGHTS = [
  { id: "records", icon: Stethoscope },
  { id: "schedule", icon: CalendarClock },
  { id: "inventory", icon: Package },
] as const;

/** Una credencial por rol — las mismas que siembra `prisma/seed.ts`. */
const DEMO_ACCOUNTS = [
  { role: "ADMIN", username: "admin", password: "admin123" },
  { role: "VET", username: "veterinario", password: "vet123" },
  { role: "RECEPTIONIST", username: "recepcion", password: "recepcion123" },
] as const;

export function LoginPage() {
  const { t } = useTranslation();
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [capsLockOn, setCapsLockOn] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isAuthenticated) {
    const target = (location.state as { from?: string } | null)?.from ?? "/app";
    return <Navigate to={target} replace />;
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await login(username, password);
      navigate("/app");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t("login.error"));
    } finally {
      setIsSubmitting(false);
    }
  }

  /** El teclado en mayúsculas es la causa más común de un login fallido — avisarlo
   * antes de que la persona lo intente ahorra el error innecesario. */
  function trackCapsLock(event: KeyboardEvent<HTMLInputElement>) {
    setCapsLockOn(event.getModifierState("CapsLock"));
  }

  function useDemoAccount(account: (typeof DEMO_ACCOUNTS)[number]) {
    setUsername(account.username);
    setPassword(account.password);
    setError(null);
  }

  return (
    <div className="min-h-svh lg:grid lg:grid-cols-[1.1fr_1fr]">
      {/* Panel de marca — solo en escritorio; en móvil la cabecera compacta de abajo
          cumple el mismo rol sin robarle espacio al formulario. */}
      <aside className="relative hidden overflow-hidden bg-primary p-12 text-primary-foreground lg:flex lg:flex-col lg:justify-between">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 -top-24 size-96 rounded-full bg-primary-foreground/10 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-32 -left-16 size-96 rounded-full bg-primary-foreground/5 blur-3xl"
        />

        <div className="relative flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-xl bg-primary-foreground/15">
            <PawPrint className="size-6" />
          </div>
          <span className="text-xl font-semibold tracking-tight">PawCare</span>
        </div>

        <div className="relative flex flex-col gap-10">
          <div className="flex flex-col gap-3">
            <h1 className="max-w-md text-4xl font-semibold leading-tight tracking-tight">
              {t("login.headline")}
            </h1>
            <p className="max-w-md text-primary-foreground/80">
              {t("login.subheadline")}
            </p>
          </div>

          <ul className="flex max-w-md flex-col gap-5">
            {HIGHLIGHTS.map(({ id, icon: Icon }) => (
              <li key={id} className="flex gap-3">
                <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary-foreground/15">
                  <Icon className="size-4.5" />
                </div>
                <div className="flex flex-col gap-0.5">
                  <p className="font-medium">{t(`login.highlights.${id}.title`)}</p>
                  <p className="text-sm text-primary-foreground/75">{t(`login.highlights.${id}.description`)}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-sm text-primary-foreground/60">
          {t("login.footer")}
        </p>
      </aside>

      {/* Formulario */}
      <main className="relative flex items-center justify-center bg-background px-4 py-10 sm:px-6">
        <LanguageToggle className="absolute right-4 top-4" />
        <div className="flex w-full max-w-sm flex-col gap-8">
          {/* Cabecera compacta — reemplaza al panel de marca en móvil/tablet */}
          <div className="flex flex-col items-center gap-2 text-center lg:hidden">
            <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10">
              <PawPrint className="size-6 text-primary" />
            </div>
            <span className="text-xl font-semibold tracking-tight">PawCare</span>
            <p className="text-sm text-muted-foreground">{t("login.tagline")}</p>
          </div>

          <div className="flex flex-col gap-1">
            <h2 className="text-2xl font-semibold tracking-tight">{t("login.signIn")}</h2>
            <p className="text-sm text-muted-foreground">{t("login.signInHint")}</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-1.5">
                <Label htmlFor="username">{t("common.username")}</Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      tabIndex={-1}
                      aria-label={t("login.usernameHelpLabel")}
                      className="text-muted-foreground/70 transition-colors hover:text-foreground"
                    >
                      <HelpCircle className="size-3.5" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {t("login.usernameHelp")}
                  </TooltipContent>
                </Tooltip>
              </div>
              <Input
                id="username"
                autoComplete="username"
                placeholder={t("login.usernamePlaceholder")}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoFocus
              />
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between gap-2">
                <Label htmlFor="password">{t("common.password")}</Label>
                <Link
                  to="/forgot-password"
                  className="text-xs text-muted-foreground transition-colors hover:text-primary hover:underline"
                >
                  {t("login.forgotPassword")}
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyUp={trackCapsLock}
                  onKeyDown={trackCapsLock}
                  onBlur={() => setCapsLockOn(false)}
                  required
                  className="pr-10"
                />
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                      aria-label={showPassword ? t("login.hidePassword") : t("login.showPassword")}
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>{showPassword ? t("login.hidePassword") : t("login.showPassword")}</TooltipContent>
                </Tooltip>
              </div>

              {capsLockOn && (
                <p className="flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400">
                  <LockKeyhole className="size-3.5 shrink-0" />
                  {t("login.capsLockOn")}
                </p>
              )}
            </div>

            {error && (
              <p
                role="alert"
                className="flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2.5 text-sm text-destructive"
              >
                <AlertCircle className="mt-0.5 size-4 shrink-0" />
                {error}
              </p>
            )}

            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting && <Loader2 className="size-4 animate-spin" />}
              {isSubmitting ? t("login.checking") : t("login.signIn")}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            {t("login.noAccount")}{" "}
            <Tooltip>
              <TooltipTrigger asChild>
                <Link to="/register" className="font-medium text-primary hover:underline">
                  {t("login.requestAccess")}
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                {t("login.requestAccessHelp")}
              </TooltipContent>
            </Tooltip>
          </p>

          <DemoAccounts onPick={useDemoAccount} t={t} />
        </div>
      </main>
    </div>
  );
}

function DemoAccounts({
  onPick,
  t,
}: {
  onPick: (account: (typeof DEMO_ACCOUNTS)[number]) => void;
  t: TFunction;
}) {
  return (
    <div className="flex flex-col gap-2 rounded-lg border bg-muted/40 p-3">
      <div className="flex items-center gap-1.5">
        <p className="text-xs font-medium">{t("login.demoAccounts")}</p>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              tabIndex={-1}
              aria-label={t("login.demoAccountsHelpLabel")}
              className="text-muted-foreground/70 transition-colors hover:text-foreground"
            >
              <HelpCircle className="size-3.5" />
            </button>
          </TooltipTrigger>
          <TooltipContent>
            {t("login.demoAccountsHelp")}
          </TooltipContent>
        </Tooltip>
      </div>

      <div className="flex flex-col gap-1">
        {DEMO_ACCOUNTS.map((account) => (
          <Tooltip key={account.username}>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={() => onPick(account)}
                className={cn(
                  "flex items-center justify-between gap-3 rounded-md px-2 py-1.5 text-left transition-colors",
                  "hover:bg-background focus-visible:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                )}
              >
                <span className="text-xs font-medium">{t(`enums.role.${account.role}`)}</span>
                <span className="font-mono text-[11px] text-muted-foreground">
                  {account.username} / {account.password}
                </span>
              </button>
            </TooltipTrigger>
            <TooltipContent side="left">{t(`login.demoHints.${account.role}`)}</TooltipContent>
          </Tooltip>
        ))}
      </div>
    </div>
  );
}
