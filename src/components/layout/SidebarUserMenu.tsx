import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/features/auth/AuthContext";
import { ROL_LABEL } from "@/lib/roles";
import { ChevronsUpDown, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface SidebarUserMenuProps {
  onNavigate?: () => void;
}

export function SidebarUserMenu({ onNavigate }: SidebarUserMenuProps) {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    onNavigate?.();
    logout();
    navigate("/login");
  }

  const iniciales = usuario ? `${usuario.nombre[0]}${usuario.apellidoPaterno[0]}` : "?";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex w-full items-center gap-2 rounded-md p-2 text-left transition-colors hover:bg-sidebar-accent">
          <Avatar className="size-8 shrink-0">
            <AvatarFallback className="bg-primary text-xs text-primary-foreground">{iniciales}</AvatarFallback>
          </Avatar>
          <div className="flex min-w-0 flex-1 flex-col">
            <span className="truncate text-sm font-medium text-sidebar-foreground">
              {usuario?.nombre} {usuario?.apellidoPaterno}
            </span>
            <span className="truncate text-xs text-sidebar-foreground/60">
              {usuario ? ROL_LABEL[usuario.rol] : ""}
            </span>
          </div>
          <ChevronsUpDown className="size-4 shrink-0 text-sidebar-foreground/50" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" side="top" className="w-56">
        <DropdownMenuLabel>{usuario ? ROL_LABEL[usuario.rol] : ""}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="size-4" />
          Cerrar sesión
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
