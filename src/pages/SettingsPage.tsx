import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/features/auth/AuthContext";
import { COLOR_THEMES, useColorTheme } from "@/features/color-theme/ColorThemeContext";
import { exportsApi } from "@/features/exports/api";
import { LANGUAGES } from "@/i18n";
import { cn } from "@/lib/utils";
import { Check, Download, Languages, Laptop, Loader2, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { ChangePasswordDialog } from "./ChangePasswordDialog";

const THEME_OPTIONS = [
  { value: "light", icon: Sun },
  { value: "dark", icon: Moon },
  { value: "system", icon: Laptop },
] as const;

const OPTION_CLASS =
  "flex flex-col items-center gap-2 rounded-lg border p-4 text-sm font-medium transition-colors";

export function SettingsPage() {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const { colorTheme, setColorTheme } = useColorTheme();
  const [exporting, setExporting] = useState(false);

  const initials = user ? `${user.firstName[0]}${user.paternalLastName[0]}` : "?";
  const currentLanguage = i18n.resolvedLanguage ?? i18n.language;

  async function handleExport() {
    setExporting(true);
    try {
      await exportsApi.downloadFull();
      toast.success(t("settings.exportSuccess"));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("settings.exportError"));
    } finally {
      setExporting(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{t("settings.title")}</h1>
        <p className="text-muted-foreground">{t("settings.subtitle")}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t("settings.account.title")}</CardTitle>
          <CardDescription>{t("settings.account.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Avatar className="size-14">
              <AvatarFallback className="bg-primary text-lg text-primary-foreground">{initials}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-base font-medium">
                {user?.firstName} {user?.paternalLastName}
              </span>
              <span className="text-sm text-muted-foreground">@{user?.username}</span>
              <span className="text-sm text-muted-foreground">
                {user ? t(`enums.role.${user.role}`) : ""}
              </span>
            </div>
            <div className="ml-auto">
              <ChangePasswordDialog />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t("settings.appearance.title")}</CardTitle>
          <CardDescription>{t("settings.appearance.description")}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <div>
            <Label className="mb-3 block">{t("settings.appearance.theme")}</Label>
            <div className="grid grid-cols-3 gap-3 sm:max-w-md">
              {THEME_OPTIONS.map((option) => {
                const Icon = option.icon;
                const isActive = theme === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setTheme(option.value)}
                    className={cn(OPTION_CLASS, isActive ? "border-primary bg-primary/5 text-primary" : "hover:bg-accent")}
                  >
                    <Icon className="size-5" />
                    {t(`settings.themes.${option.value}`)}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <Label className="mb-3 block">{t("settings.appearance.color")}</Label>
            <div className="grid grid-cols-3 gap-3 sm:max-w-md">
              {COLOR_THEMES.map((option) => {
                const isActive = colorTheme === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setColorTheme(option.value)}
                    className={cn(OPTION_CLASS, isActive ? "border-primary bg-primary/5 text-primary" : "hover:bg-accent")}
                  >
                    <span
                      className="relative flex size-7 items-center justify-center rounded-full"
                      style={{ backgroundColor: option.swatch }}
                    >
                      {isActive && <Check className="size-4 text-white drop-shadow" />}
                    </span>
                    {t(`settings.colors.${option.value}`)}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <Label className="mb-1 block">{t("language.label")}</Label>
            <p className="mb-3 text-sm text-muted-foreground">{t("language.description")}</p>
            <div className="grid grid-cols-2 gap-3 sm:max-w-xs">
              {LANGUAGES.map((language) => {
                const isActive = currentLanguage === language.value;
                return (
                  <button
                    key={language.value}
                    type="button"
                    onClick={() => i18n.changeLanguage(language.value)}
                    className={cn(OPTION_CLASS, isActive ? "border-primary bg-primary/5 text-primary" : "hover:bg-accent")}
                  >
                    <Languages className="size-5" />
                    {language.label}
                  </button>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {user?.role === "ADMIN" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t("settings.data.title")}</CardTitle>
            <CardDescription>{t("settings.data.description")}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" onClick={handleExport} disabled={exporting}>
              {exporting ? <Loader2 className="size-4 animate-spin" /> : <Download className="size-4" />}
              {t("settings.data.exportAll")}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
