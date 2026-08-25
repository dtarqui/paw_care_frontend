import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export interface MobileCardRow {
  label: string;
  value: ReactNode;
}

interface MobileCardProps {
  /** Lo que identifica la fila: nombre de la mascota, del propietario, del medicamento… */
  title: ReactNode;
  /** Contexto inmediato bajo el título (dueño, especie, código de cita…). */
  subtitle?: ReactNode;
  /** Estado o etiqueta, alineado a la derecha del título. */
  badge?: ReactNode;
  /** El resto de los datos, como pares etiqueta/valor. Omitir los vacíos. */
  rows?: MobileCardRow[];
  /** Botones de la fila. Se apilan al pie, a ancho completo si son varios. */
  actions?: ReactNode;
  /** Si la fila navega a un detalle, igual que el `onClick` de la fila en la tabla. */
  onClick?: () => void;
  className?: string;
}

/**
 * Versión en tarjeta de una fila de tabla, para pantallas chicas.
 *
 * Las tablas de esta app llegan a 12 columnas (Pagos) y 11 (Reportes clínicos): en un
 * celular eso es scroll horizontal y tres columnas visibles. Como PawCare es una PWA
 * instalable pensada para el mostrador, cada listado muestra `<MobileCard>` por debajo
 * de `md` y la `<Table>` de ahí para arriba.
 *
 * La tarjeta prioriza: título → estado → datos → acciones. Lo que en la tabla es una
 * columna secundaria acá va como par etiqueta/valor, y lo prescindible simplemente no
 * se pasa.
 */
export function MobileCard({ title, subtitle, badge, rows, actions, onClick, className }: MobileCardProps) {
  const interactive = typeof onClick === "function";

  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-lg border bg-card p-3.5",
        interactive && "cursor-pointer transition-colors hover:bg-accent/40",
        className
      )}
      onClick={onClick}
      role={interactive ? "button" : undefined}
      tabIndex={interactive ? 0 : undefined}
      onKeyDown={
        interactive
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick?.();
              }
            }
          : undefined
      }
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-col">
          <span className="truncate font-medium">{title}</span>
          {subtitle && <span className="truncate text-sm text-muted-foreground">{subtitle}</span>}
        </div>
        {badge && <div className="shrink-0">{badge}</div>}
      </div>

      {rows && rows.length > 0 && (
        <dl className="flex flex-col gap-1.5 border-t pt-3 text-sm">
          {rows.map((row) => (
            <div key={row.label} className="flex items-baseline justify-between gap-3">
              <dt className="shrink-0 text-muted-foreground">{row.label}</dt>
              <dd className="min-w-0 text-right">{row.value}</dd>
            </div>
          ))}
        </dl>
      )}

      {actions && <div className="flex flex-wrap gap-2 border-t pt-3">{actions}</div>}
    </div>
  );
}

/** Contenedor de las tarjetas: visible solo por debajo de `md`. */
export function MobileCardList({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("flex flex-col gap-2 md:hidden", className)}>{children}</div>;
}

/** Contraparte: la tabla, visible solo de `md` para arriba. */
export function DesktopTable({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("hidden md:block", className)}>{children}</div>;
}
