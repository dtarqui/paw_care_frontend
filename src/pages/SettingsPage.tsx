import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/features/auth/AuthContext";
import { COLOR_THEMES, useColorTheme } from "@/features/color-theme/ColorThemeContext";
import { exportsApi } from "@/features/exports/api";
import { ROLE_LABEL } from "@/lib/roles";
import { cn } from "@/lib/utils";
import { Check, Download, Laptop, Loader2, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useState } from "react";
import { toast } from "sonner";
import { ChangePasswordDialog } from "./ChangePasswordDialog";

const THEME_OPTIONS = [
  { value: "light", label: "Claro", icon: Sun },
  { value: "dark", label: "Oscuro", icon: Moon },
  { value: "system", label: "Sistema", icon: Laptop },
] as const;

export function SettingsPage() {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const { colorTheme, setColorTheme } = useColorTheme();
  const [exporting, setExporting] = useState(false);

  const initials = user ? `${user.firstName[0]}${user.paternalLastName[0]}` : "?";

  async function handleExport() {
    setExporting(true);
    try {
      await exportsApi.downloadFull();
      toast.success("Datos exportados correctamente");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "No se pudo exportar");
    } finally {
      setExporting(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Configuración</h1>
        <p className="text-muted-foreground">Preferencias de la aplicación y datos de tu cuenta</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Cuenta</CardTitle>
          <CardDescription>Información de la sesión actual</CardDescription>
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
              <span className="text-sm text-muted-foreground">{user ? ROLE_LABEL[user.role] : ""}</span>
            </div>
            <div className="ml-auto">
              <ChangePasswordDialog />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Apariencia</CardTitle>
          <CardDescription>Elige cómo se ve PawCare en este dispositivo</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <div>
            <Label className="mb-3 block">Tema</Label>
            <div className="grid grid-cols-3 gap-3 sm:max-w-md">
              {THEME_OPTIONS.map((option) => {
                const Icon = option.icon;
                const isActive = theme === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setTheme(option.value)}
                    className={cn(
                      "flex flex-col items-center gap-2 rounded-lg border p-4 text-sm font-medium transition-colors",
                      isActive ? "border-primary bg-primary/5 text-primary" : "hover:bg-accent"
                    )}
                  >
                    <Icon className="size-5" />
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <Label className="mb-3 block">Color</Label>
            <div className="grid grid-cols-3 gap-3 sm:max-w-md">
              {COLOR_THEMES.map((option) => {
                const isActive = colorTheme === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setColorTheme(option.value)}
                    className={cn(
                      "flex flex-col items-center gap-2 rounded-lg border p-4 text-sm font-medium transition-colors",
                      isActive ? "border-primary bg-primary/5 text-primary" : "hover:bg-accent"
                    )}
                  >
                    <span
                      className="relative flex size-7 items-center justify-center rounded-full"
                      style={{ backgroundColor: option.swatch }}
                    >
                      {isActive && <Check className="size-4 text-white drop-shadow" />}
                    </span>
                    {option.label}
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
            <CardTitle className="text-base">Datos</CardTitle>
            <CardDescription>Exporta toda la información de la clínica en cualquier momento, sin depender de PawCare</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" onClick={handleExport} disabled={exporting}>
              {exporting ? <Loader2 className="size-4 animate-spin" /> : <Download className="size-4" />}
              Exportar todos mis datos
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
