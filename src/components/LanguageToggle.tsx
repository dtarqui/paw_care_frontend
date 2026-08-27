import { LANGUAGES } from "@/i18n";
import { cn } from "@/lib/utils";
import { Languages } from "lucide-react";
import { useTranslation } from "react-i18next";

/** Selector compacto de idioma (ES | EN) para las pantallas públicas, donde no hay
 * Configuración a mano: quien recibe una invitación por correo tiene que poder
 * leer el formulario en su idioma antes de tener cuenta. */
export function LanguageToggle({ className }: { className?: string }) {
  const { i18n, t } = useTranslation();
  const current = i18n.resolvedLanguage ?? i18n.language;

  return (
    <div
      className={cn("flex items-center gap-1 rounded-full border bg-background/80 p-1 backdrop-blur", className)}
      role="group"
      aria-label={t("language.switch")}
    >
      <Languages className="ml-1.5 size-3.5 text-muted-foreground" aria-hidden />
      {LANGUAGES.map((language) => (
        <button
          key={language.value}
          type="button"
          onClick={() => i18n.changeLanguage(language.value)}
          aria-pressed={current === language.value}
          className={cn(
            "rounded-full px-2.5 py-1 text-xs font-medium uppercase transition-colors",
            current === language.value
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {language.value}
        </button>
      ))}
    </div>
  );
}
