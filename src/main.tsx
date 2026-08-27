import { Toaster } from "@/components/ui/sonner";
import { ColorThemeProvider } from "@/features/color-theme/ColorThemeContext";
import { queryClient } from "@/lib/query-client";
import { QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { App } from "./App.tsx";
// Inicializa i18next (español por defecto) antes de que se monte cualquier pantalla.
import "./i18n";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <ColorThemeProvider>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
          <Toaster position="top-right" richColors />
        </QueryClientProvider>
      </ColorThemeProvider>
    </ThemeProvider>
  </StrictMode>
);
