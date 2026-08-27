import { GlobalSearch, useGlobalSearchShortcut } from "@/components/GlobalSearch";
import { Outlet } from "react-router-dom";
import { MobileHeader } from "./MobileHeader";
import { Sidebar } from "./Sidebar";

export function AppShell() {
  // El shell es dueño del estado de la búsqueda global: existe en toda la app
  // autenticada, y tanto el sidebar como la cabecera móvil solo la abren.
  const { open, setOpen } = useGlobalSearchShortcut();

  return (
    <div className="flex h-svh flex-col lg:flex-row">
      <aside className="hidden w-64 shrink-0 border-r bg-sidebar lg:flex lg:flex-col">
        <Sidebar onOpenSearch={() => setOpen(true)} />
      </aside>

      <div className="flex flex-1 flex-col overflow-hidden">
        <MobileHeader onOpenSearch={() => setOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="mx-auto w-full max-w-6xl">
            <Outlet />
          </div>
        </main>
      </div>

      <GlobalSearch open={open} onOpenChange={setOpen} />
    </div>
  );
}
