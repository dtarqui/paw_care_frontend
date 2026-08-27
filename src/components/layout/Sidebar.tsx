import { groupTitle, moduleTitle } from "@/features/dashboard/labels";
import { useModules } from "@/features/dashboard/useModules";
import { cn } from "@/lib/utils";
import { LayoutDashboard, PawPrint, Search } from "lucide-react";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";
import { ICON_MAP } from "./icon-map";
import { SidebarUserMenu } from "./SidebarUserMenu";

interface SidebarProps {
  onNavigate?: () => void;
  onOpenSearch?: () => void;
}

export function Sidebar({ onNavigate, onOpenSearch }: SidebarProps) {
  const { t } = useTranslation();
  // Los grupos, su orden y qué módulos caen en cada uno los define el backend
  // (dashboard.service.ts) según el rol — acá no hay ninguna tabla de permisos.
  const { groupedModules, isLoading } = useModules();

  return (
    <nav className="flex h-full flex-col">
      <div className="flex h-14 shrink-0 items-center gap-2 border-b border-sidebar-border px-4">
        <PawPrint className="size-6 text-primary" />
        <span className="text-lg font-semibold">PawCare</span>
      </div>

      <div className="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
        {onOpenSearch && (
          <button
            type="button"
            onClick={() => {
              onNavigate?.();
              onOpenSearch();
            }}
            className="mb-2 flex items-center gap-2 rounded-md border border-sidebar-border/70 px-3 py-2 text-sm text-sidebar-foreground/60 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          >
            <Search className="size-4" />
            <span>{t("nav.searchPlaceholder")}</span>
            <kbd className="ml-auto rounded border border-sidebar-border bg-sidebar-accent/50 px-1.5 py-0.5 font-sans text-[10px]">
              Ctrl K
            </kbd>
          </button>
        )}

        <SidebarLink to="/app" end onClick={onNavigate}>
          <LayoutDashboard className="size-4" />
          {t("nav.home")}
        </SidebarLink>

        {isLoading &&
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="mx-1 my-1 h-9 animate-pulse rounded-md bg-muted" />
          ))}

        {groupedModules.map(({ group, modules }) => (
          <div key={group.id} className="mt-4 flex flex-col gap-1 first:mt-2">
            <p className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-sidebar-foreground/45">
              {groupTitle(t, group)}
            </p>
            {modules.map((module) => {
              const Icon = ICON_MAP[module.icon] ?? PawPrint;
              return (
                <SidebarLink key={module.id} to={module.route} onClick={onNavigate}>
                  <Icon className="size-4" />
                  {moduleTitle(t, module)}
                </SidebarLink>
              );
            })}
          </div>
        ))}
      </div>

      <div className="border-t border-sidebar-border p-3">
        <SidebarUserMenu onNavigate={onNavigate} />
      </div>
    </nav>
  );
}

function SidebarLink({
  to,
  end,
  onClick,
  children,
}: {
  to: string;
  end?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  return (
    <NavLink
      to={to}
      end={end}
      onClick={onClick}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-sidebar-foreground/80 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
          isActive && "bg-sidebar-accent text-sidebar-accent-foreground"
        )
      }
    >
      {children}
    </NavLink>
  );
}
