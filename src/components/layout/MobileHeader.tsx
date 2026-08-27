import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, PawPrint, Search } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Sidebar } from "./Sidebar";

/**
 * Visible por debajo de `lg`: el sidebar completo (con el menú de perfil incluido)
 * vive en un Sheet lateral. De `lg` para arriba el sidebar ya está siempre visible,
 * así que esta barra no se renderiza.
 *
 * El corte es `lg` y no `md` porque en una tablet de 768px el sidebar fijo dejaba
 * apenas 512px de contenido, y con eso las tablas y los formularios no entran.
 */
export function MobileHeader({ onOpenSearch }: { onOpenSearch?: () => void }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b bg-background px-4 lg:hidden">
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
