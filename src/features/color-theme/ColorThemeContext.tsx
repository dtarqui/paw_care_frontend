import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export const COLOR_THEMES = [
  { value: "violeta", label: "Violeta", swatch: "oklch(0.541 0.245 292.5)" },
  { value: "oceano", label: "Océano", swatch: "oklch(0.50 0.19 225)" },
  { value: "rosa", label: "Rosa", swatch: "oklch(0.54 0.21 330)" },
] as const;

export type ColorTheme = (typeof COLOR_THEMES)[number]["value"];

const STORAGE_KEY = "pawcare.color-theme";
const DEFAULT_COLOR_THEME: ColorTheme = "violeta";

interface ColorThemeContextValue {
  colorTheme: ColorTheme;
  setColorTheme: (theme: ColorTheme) => void;
}

const ColorThemeContext = createContext<ColorThemeContextValue | undefined>(undefined);

function leer(): ColorTheme {
  const guardado = localStorage.getItem(STORAGE_KEY);
  return (COLOR_THEMES.some((t) => t.value === guardado) ? guardado : DEFAULT_COLOR_THEME) as ColorTheme;
}

export function ColorThemeProvider({ children }: { children: ReactNode }) {
  const [colorTheme, setColorThemeState] = useState<ColorTheme>(leer);

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
