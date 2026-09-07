import { Skeleton } from "@/components/ui/skeleton";
import { t } from "i18next";

/**
 * Lo que se ve mientras un guarda de ruta todavía no sabe si deja pasar.
 *
 * Antes esos guardas devolvían `null`, o sea **una pantalla en blanco**: correcto
 * en la máquina de desarrollo, donde la espera es un parpadeo, y muy malo en
 * cualquier conexión lenta o contra un backend recién despertado, donde son varios
 * segundos de blanco puro. Blanco es exactamente lo que se ve cuando una aplicación
 * se rompe, así que quien mira no puede distinguir "cargando" de "roto" — un agente
 * de grabación automática lo reportó tal cual, como pantalla en blanco persistente.
 *
 * Usa `Skeleton` (el mismo `animate-pulse` que el resto de la app) en vez de una
 * animación nueva, así no hay nada extra que apagar bajo `prefers-reduced-motion`.
 */
export function RouteFallback() {
  return (
    <div className="flex flex-col gap-4" role="status" aria-busy="true" aria-live="polite">
      <span className="sr-only">{t("common.loading")}</span>
      <Skeleton className="h-8 w-56" />
      <Skeleton className="h-4 w-80" />
      <div className="mt-2 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Skeleton className="h-28" />
        <Skeleton className="h-28" />
        <Skeleton className="h-28" />
      </div>
      <Skeleton className="h-64" />
    </div>
  );
}
