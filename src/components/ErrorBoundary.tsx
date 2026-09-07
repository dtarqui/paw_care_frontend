import { Button } from "@/components/ui/button";
import { t } from "i18next";
import { TriangleAlert } from "lucide-react";
import { Component, type ErrorInfo, type ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

/**
 * Red de contención para un error de render.
 *
 * Sin esto, React desmonta el árbol entero y deja **la pestaña en blanco**: sin
 * mensaje, sin botón, sin forma de salir salvo recargar a mano — y quien mira no
 * tiene manera de saber si la aplicación se rompió o simplemente no terminó de
 * cargar. Ahora se ve qué pasó y hay por dónde seguir.
 *
 * Es un componente de clase porque `componentDidCatch` no tiene equivalente en
 * hooks. Por eso el texto sale de `t` importado de i18next y no de `useTranslation`
 * — la misma salida que usa el resto del código fuera de un componente de función.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Hasta que haya observabilidad de verdad (MEJORAS_PRODUCTO.md 4.1), el log del
    // navegador es lo único que queda del error: se anota entero, con el árbol.
    console.error("Error de render no capturado:", error, info.componentStack);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 p-6 text-center">
        <TriangleAlert className="size-10 text-destructive" aria-hidden="true" />
        <div className="flex flex-col gap-1">
          <h1 className="text-lg font-semibold">{t("errors.boundaryTitle")}</h1>
          <p className="max-w-md text-sm text-muted-foreground">{t("errors.boundaryDescription")}</p>
        </div>
        <Button onClick={() => window.location.reload()}>{t("errors.boundaryRetry")}</Button>
      </div>
    );
  }
}
