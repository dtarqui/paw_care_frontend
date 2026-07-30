import { Outlet } from "react-router-dom";
import { MobileHeader } from "./MobileHeader";
import { Sidebar } from "./Sidebar";

export function AppShell() {
  return (
    <div className="flex h-svh flex-col md:flex-row">
      <aside className="hidden w-64 shrink-0 border-r bg-sidebar md:flex md:flex-col">
        <Sidebar />
      </aside>

      <div className="flex flex-1 flex-col overflow-hidden">
        <MobileHeader />
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="mx-auto w-full max-w-6xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
