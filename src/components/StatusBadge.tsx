import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<string, string> = {
  CONFIRMADA: "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400",
  ATENDIDA: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400",
  CANCELADA: "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400",
  PENDIENTE: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400",
  PAGADO: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400",
  ACTIVO: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400",
  INACTIVO: "bg-muted text-muted-foreground",
};

const STATUS_LABEL: Record<string, string> = {
  CONFIRMADA: "Confirmada",
  ATENDIDA: "Atendida",
  CANCELADA: "Cancelada",
  PENDIENTE: "Pendiente",
  PAGADO: "Pagado",
  ACTIVO: "Activo",
  INACTIVO: "Inactivo",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <Badge className={cn("border-none font-medium", STATUS_STYLES[status])} variant="secondary">
      {STATUS_LABEL[status] ?? status}
    </Badge>
  );
}
