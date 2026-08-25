import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useModule } from "@/features/dashboard/useModules";
import { useState } from "react";
import { AuditLogTab } from "./AuditLogTab";
import { UsersListTab } from "./UsersListTab";

/**
 * Usuarios: cuentas y registro de auditoría en una sola pantalla. La auditoría es,
 * literalmente, la bitácora de las acciones administrativas sobre estas mismas
 * cuentas (activar, cambiar rol, restablecer contraseña, invitar), así que se lee
 * al lado del listado y no como una sección aparte del menú.
 *
 * Qué pestañas se muestran lo decide el backend (`dashboard.service.ts`, campo
 * `tabs` del módulo "users").
 */
export function UsersPage() {
  const [tab, setTab] = useState("list");
  const { module } = useModule("users");

  const availableTabs = module?.tabs ?? ["list"];
  const showAudit = availableTabs.includes("audit");

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Usuarios</h1>
        <p className="text-muted-foreground">{module?.description ?? "Registro y gestión de cuentas"}</p>
      </div>

      {showAudit ? (
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList>
            <TabsTrigger value="list">Cuentas</TabsTrigger>
            <TabsTrigger value="audit">Auditoría</TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="mt-4">
            <UsersListTab />
          </TabsContent>

          <TabsContent value="audit" className="mt-4">
            <AuditLogTab />
          </TabsContent>
        </Tabs>
      ) : (
        <UsersListTab />
      )}
    </div>
  );
}
