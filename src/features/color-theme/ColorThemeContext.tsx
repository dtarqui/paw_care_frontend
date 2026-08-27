import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

/** El acento de marca. `value` es el slug que va a `data-color-theme` en `<html>`
 * y a localStorage; la etiqueta visible sale de `settings.colors.*` en las
 * traducciones, para que siga al idioma elegido. */
export const COLOR_THEMES = [
  { value: "violet", swatch: "oklch(0.541 0.245 292.5)" },
  { value: "ocean", swatch: "oklch(0.50 0.19 225)" },
  { value: "pink", swatch: "oklch(0.54 0.21 330)" },
] as const;

export type ColorTheme = (typeof COLOR_THEMES)[number]["value"];

const STORAGE_KEY = "pawcare.color-theme";
const DEFAULT_COLOR_THEME: ColorTheme = "violet";

/** Los slugs eran españoles hasta que el código pasó íntegramente a inglés. Un
 * navegador que ya tenía elegido un acento sigue guardando el valor viejo, así
 * que se traduce al leerlo en vez de resetearlo al violeta por defecto. El mismo
 * mapa está en el script sin bloqueo de `index.html`. */
const LEGACY_VALUES: Record<string, ColorTheme> = {
  violeta: "violet",
  oceano: "ocean",
  rosa: "pink",
};

interface ColorThemeContextValue {
  colorTheme: ColorTheme;
  setColorTheme: (theme: ColorTheme) => void;
}

const ColorThemeContext = createContext<ColorThemeContextValue | undefined>(undefined);

function readStoredColorTheme(): ColorTheme {
  const raw = localStorage.getItem(STORAGE_KEY);
  const stored = raw && LEGACY_VALUES[raw] ? LEGACY_VALUES[raw] : raw;
  return (COLOR_THEMES.some((t) => t.value === stored) ? stored : DEFAULT_COLOR_THEME) as ColorTheme;
}

export function ColorThemeProvider({ children }: { children: ReactNode }) {
  const [colorTheme, setColorThemeState] = useState<ColorTheme>(readStoredColorTheme);

  useEffect(() => {
    document.documentElement.setAttribute("data-color-theme", colorTheme);
  }, [colorTheme]);

  function setColorTheme(theme: ColorTheme) {
    localStorage.setItem(STORAGE_KEY, theme);
    setColorThemeState(theme);
  }

  return <ColorThemeContext.Provider value={{ colorTheme, setColorTheme }}>{children}</ColorThemeContext.Provider>;
}

export function useColorTheme() {
  const ctx = useContext(ColorThemeContext);
  if (!ctx) throw new Error("useColorTheme debe usarse dentro de <ColorThemeProvider>");
  return ctx;
}
