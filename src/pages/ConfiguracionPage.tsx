import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/features/auth/AuthContext";
import { ROL_LABEL } from "@/lib/roles";
import { cn } from "@/lib/utils";
import { Laptop, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

const OPCIONES_TEMA = [
  { value: "light", label: "Claro", icon: Sun },
  { value: "dark", label: "Oscuro", icon: Moon },
  { value: "system", label: "Sistema", icon: Laptop },
] as const;

export function ConfiguracionPage() {
  const { usuario } = useAuth();
  const { theme, setTheme } = useTheme();

  const iniciales = usuario ? `${usuario.nombre[0]}${usuario.apellidoPaterno[0]}` : "?";

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
              <AvatarFallback className="bg-primary text-lg text-primary-foreground">{iniciales}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-base font-medium">
                {usuario?.nombre} {usuario?.apellidoPaterno}
              </span>
              <span className="text-sm text-muted-foreground">@{usuario?.username}</span>
              <span className="text-sm text-muted-foreground">{usuario ? ROL_LABEL[usuario.rol] : ""}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Apariencia</CardTitle>
          <CardDescription>Elige cómo se ve PawCare en este dispositivo</CardDescription>
        </CardHeader>
        <CardContent>
          <Label className="mb-3 block">Tema</Label>
          <div className="grid grid-cols-3 gap-3 sm:max-w-md">
            {OPCIONES_TEMA.map((opcion) => {
              const Icon = opcion.icon;
              const activo = theme === opcion.value;
              return (
                <button
                  key={opcion.value}
                  type="button"
                  onClick={() => setTheme(opcion.value)}
                  className={cn(
                    "flex flex-col items-center gap-2 rounded-lg border p-4 text-sm font-medium transition-colors",
                    activo ? "border-primary bg-primary/5 text-primary" : "hover:bg-accent"
                  )}
                >
                  <Icon className="size-5" />
                  {opcion.label}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
