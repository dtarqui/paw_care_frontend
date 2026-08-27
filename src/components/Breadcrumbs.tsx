import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export interface BreadcrumbItem {
  label: string;
  /** Sin `to`, el ítem es la página actual: se renderiza como texto, no como enlace. */
  to?: string;
}

/**
 * Rastro de navegación para pantallas profundas (las que se alcanzan desde más de
 * un lugar, como la ficha de mascota: se llega desde Mascotas y desde Propietarios).
 * Reemplaza al "Volver a X", que siempre apuntaba al mismo sitio sin importar de
 * dónde vinieras y no mostraba en qué nivel estás.
 *
 * Solo describe el camino; no decide cuál es. Cada pantalla arma su propia lista,
 * y puede derivarla del origen real de la navegación si lo conoce.
 */
export function Breadcrumbs({ items, className }: { items: BreadcrumbItem[]; className?: string }) {
  const { t } = useTranslation();

  return (
    <nav aria-label={t("nav.breadcrumb")} className={cn("flex items-center gap-1 text-sm", className)}>
      <ol className="flex flex-wrap items-center gap-1">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-1">
              {item.to && !isLast ? (
                <Link to={item.to} className="text-muted-foreground transition-colors hover:text-foreground">
                  {item.label}
                </Link>
              ) : (
                <span className={cn(isLast ? "font-medium text-foreground" : "text-muted-foreground")} aria-current={isLast ? "page" : undefined}>
                  {item.label}
                </span>
              )}
              {!isLast && <ChevronRight className="size-3.5 shrink-0 text-muted-foreground/60" aria-hidden />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
