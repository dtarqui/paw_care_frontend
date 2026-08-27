import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, PawPrint, Search } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Sidebar } from "./Sidebar";

/**
 * Solo visible en mobile (md:hidden): el sidebar completo (con el menú de perfil
 * incluido) vive en un Sheet lateral. En escritorio el sidebar ya está siempre
 * visible, así que esta barra no se renderiza.
 */
export function MobileHeader({ onOpenSearch }: { onOpenSearch?: () => void }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b bg-background px-4 md:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" aria-label={t("nav.openMenu")}>
            <Menu className="size-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72 border-sidebar-border bg-sidebar p-0">
          <Sidebar onNavigate={() => setOpen(false)} onOpenSearch={onOpenSearch} />
        </SheetContent>
      </Sheet>
      <div className="flex items-center gap-2">
        <PawPrint className="size-5 text-primary" />
        <span className="font-semibold">PawCare</span>
      </div>
      {onOpenSearch && (
        <Button variant="ghost" size="icon" className="ml-auto" onClick={onOpenSearch} aria-label={t("common.search")}>
          <Search className="size-5" />
        </Button>
      )}
    </header>
  );
}
