import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
}

/** Paginador mínimo (Anterior/Siguiente + "página X de Y") — a este tamaño de
 * datos no hace falta un selector de número de página. */
export function Pagination({ page, pageSize, total, onPageChange }: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between gap-4 pt-2">
      <p className="text-sm text-muted-foreground">
        Página {page} de {totalPages} · {total} en total
      </p>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
          <ChevronLeft className="size-4" />
          Anterior
        </Button>
        <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}>
          Siguiente
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}
