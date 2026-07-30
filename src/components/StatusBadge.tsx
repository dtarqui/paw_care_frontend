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
  EFECTIVO: "bg-slate-100 text-slate-700 dark:bg-slate-500/15 dark:text-slate-300",
  TARJETA: "bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-400",
  TRANSFERENCIA: "bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-400",
  QR: "bg-teal-100 text-teal-700 dark:bg-teal-500/15 dark:text-teal-400",
};

const STATUS_LABEL: Record<string, string> = {
  CONFIRMADA: "Confirmada",
  ATENDIDA: "Atendida",
  CANCELADA: "Cancelada",
  PENDIENTE: "Pendiente",
  PAGADO: "Pagado",
  ACTIVO: "Activo",
  INACTIVO: "Inactivo",
  EFECTIVO: "Efectivo",
  TARJETA: "Tarjeta",
  TRANSFERENCIA: "Transferencia",
  QR: "QR",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <Badge className={cn("border-none font-medium", STATUS_STYLES[status])} variant="secondary">
      {STATUS_LABEL[status] ?? status}
    </Badge>
  );
}
