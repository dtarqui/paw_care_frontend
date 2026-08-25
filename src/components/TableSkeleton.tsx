import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface TableSkeletonProps {
  /** Cuántas filas simular. Conviene aproximar el tamaño real de la lista. */
  rows?: number;
  className?: string;
}

/**
 * Placeholder de carga para listados. Reemplaza el bloque
 * `Array.from({ length: n }).map(... <Skeleton className="h-10 w-full" />)` que
 * estaba copiado en 17 archivos, cada uno con su propia cantidad de filas y altura.
 */
export function TableSkeleton({ rows = 4, className }: TableSkeletonProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)} aria-busy="true" aria-live="polite">
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-11 w-full" />
      ))}
      <span className="sr-only">Cargando…</span>
    </div>
  );
}
