import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

interface EmptyStateProps {
  icon: LucideIcon;
  /** Qué falta, en una frase. Ej. "Sin mascotas registradas todavía". */
  title: string;
  /** Opcional: por qué está vacío o qué hacer al respecto. */
  description?: string;
  /** Opcional: la acción que resuelve el vacío (un botón, un diálogo). */
  action?: ReactNode;
  className?: string;
}

/**
 * Estado vacío único para toda la app. Antes cada listado repetía su propio bloque
 * (ícono + una línea de texto), con espaciados y tamaños ligeramente distintos.
 *
 * Cuando el vacío se puede resolver desde la misma pantalla, pasá `action`: una
 * pantalla recién estrenada deja de ser un callejón sin salida y pasa a indicar
 * el siguiente paso.
 */
export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center gap-3 px-6 py-12 text-center", className)}>
      <div className="flex size-12 items-center justify-center rounded-full bg-muted">
        <Icon className="size-6 text-muted-foreground" />
      </div>
      <div className="flex flex-col gap-1">
        <p className="font-medium">{title}</p>
        {description && <p className="max-w-sm text-sm text-muted-foreground">{description}</p>}
      </div>
      {action && <div className="mt-1">{action}</div>}
    </div>
  );
}

/** Error de carga — mismo encuadre visual que el estado vacío, en tono destructivo. */
export function ErrorState({ message, className }: { message: string; className?: string }) {
  return (
    <p className={cn("px-6 py-10 text-center text-sm text-destructive", className)} role="alert">
      {message}
    </p>
  );
}
