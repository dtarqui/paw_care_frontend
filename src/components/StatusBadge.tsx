import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// Las claves son los valores del backend (en inglés); las etiquetas, lo que ve
// el usuario (en español). PENDING_APPROVAL no viene del backend: lo deriva la
// pantalla de Usuarios a partir de selfRegistered + status.
const STATUS_STYLES: Record<string, string> = {
  CONFIRMED: "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400",
  ATTENDED: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400",
  CANCELLED: "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400",
  PENDING: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400",
  PAID: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400",
  ACTIVE: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400",
  INACTIVE: "bg-muted text-muted-foreground",
  PENDING_APPROVAL: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400",
  CASH: "bg-slate-100 text-slate-700 dark:bg-slate-500/15 dark:text-slate-300",
  CARD: "bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-400",
  TRANSFER: "bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-400",
  QR: "bg-teal-100 text-teal-700 dark:bg-teal-500/15 dark:text-teal-400",
};

const STATUS_LABEL: Record<string, string> = {
  CONFIRMED: "Confirmada",
  ATTENDED: "Atendida",
  CANCELLED: "Cancelada",
  PENDING: "Pendiente",
  PAID: "Pagado",
  ACTIVE: "Activo",
  INACTIVE: "Inactivo",
  PENDING_APPROVAL: "Pendiente de aprobación",
  CASH: "Efectivo",
  CARD: "Tarjeta",
  TRANSFER: "Transferencia",
  QR: "QR",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <Badge className={cn("border-none font-medium", STATUS_STYLES[status])} variant="secondary">
      {STATUS_LABEL[status] ?? status}
    </Badge>
  );
}
