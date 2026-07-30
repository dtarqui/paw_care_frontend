import { useModulos } from "@/features/dashboard/useModulos";
import { cn } from "@/lib/utils";
import { LayoutDashboard, PawPrint, Settings } from "lucide-react";
import { NavLink } from "react-router-dom";
import { ICON_MAP } from "./icon-map";
import { SidebarUserMenu } from "./SidebarUserMenu";

interface SidebarProps {
  onNavigate?: () => void;
}

export function Sidebar({ onNavigate }: SidebarProps) {
  const { data: modulos, isLoading } = useModulos();

  return (
    <nav className="flex h-full flex-col">
      <div className="flex h-14 shrink-0 items-center gap-2 border-b border-sidebar-border px-4">
        <PawPrint className="size-6 text-primary" />
        <span className="text-lg font-semibold">PawCare</span>
      </div>

      <div className="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
        <SidebarLink to="/app" end onClick={onNavigate}>
          <LayoutDashboard className="size-4" />
          Dashboard
        </SidebarLink>

        {isLoading &&
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="mx-1 my-1 h-9 animate-pulse rounded-md bg-muted" />
          ))}

        {modulos?.map((modulo) => {
          const Icon = ICON_MAP[modulo.icono] ?? PawPrint;
          return (
            <SidebarLink key={modulo.id} to={modulo.ruta} onClick={onNavigate}>
              <Icon className="size-4" />
              {modulo.titulo}
            </SidebarLink>
          );
        })}
      </div>

      <div className="flex flex-col gap-1 border-t border-sidebar-border p-3">
        <SidebarLink to="/app/configuracion" onClick={onNavigate}>
          <Settings className="size-4" />
          Configuración
        </SidebarLink>
        <div className="mt-1">
          <SidebarUserMenu onNavigate={onNavigate} />
        </div>
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
