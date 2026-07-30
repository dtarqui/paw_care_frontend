import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface StatTileProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  isLoading?: boolean;
  tone?: "default" | "warning";
}

const TONE_ICON_STYLES: Record<NonNullable<StatTileProps["tone"]>, string> = {
  default: "bg-primary/10 text-primary",
  warning: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
};

/**
 * Tile de una sola cifra (sin delta/tendencia: no hay período anterior con el
 * que compararla en esta demo — mejor no mostrar una tendencia que inventarla).
 */
export function StatTile({ label, value, icon: Icon, isLoading, tone = "default" }: StatTileProps) {
  return (
    <div className="flex items-center gap-3 rounded-xl border bg-card p-4">
      <div className={cn("flex size-10 shrink-0 items-center justify-center rounded-lg", TONE_ICON_STYLES[tone])}>
        <Icon className="size-5" />
      </div>
      <div className="flex min-w-0 flex-col">
        <span className="text-sm text-muted-foreground">{label}</span>
        {isLoading ? (
          <Skeleton className="mt-1 h-7 w-12" />
        ) : (
          <span className="text-2xl font-semibold">{value}</span>
        )}
      </div>
    </div>
  );
}
