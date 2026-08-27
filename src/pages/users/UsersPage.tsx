import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/features/auth/AuthContext";
import { moduleDescription } from "@/features/dashboard/labels";
import { useModule } from "@/features/dashboard/useModules";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { AuditLogTab } from "./AuditLogTab";
import { LoginEventsTab } from "./LoginEventsTab";
import { UsersListTab } from "./UsersListTab";

/**
 * Usuarios: cuentas, auditoría e ingresos al sistema en una sola pantalla. Las tres
 * responden preguntas sobre las mismas cuentas —quién existe, qué le hicieron a esas
 * cuentas, y quién entró con ellas— así que se leen juntas y no como secciones
 * separadas del menú.
 *
 * Qué pestañas se muestran lo decide el backend (`dashboard.service.ts`, campo
 * `tabs` del módulo "users").
 */
export function UsersPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [tab, setTab] = useState("list");
  const { module } = useModule("users");

  const availableTabs = module?.tabs ?? ["list"];
  const showAudit = availableTabs.includes("audit");
  const showLogins = availableTabs.includes("logins");
  const hasTabs = showAudit || showLogins;

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{t("users.title")}</h1>
        <p className="text-muted-foreground">
          {module ? moduleDescription(t, module, user?.role) : t("users.subtitle")}
        </p>
      </div>

      {hasTabs ? (
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="max-w-full overflow-x-auto">
            <TabsTrigger value="list">{t("users.tabs.accounts")}</TabsTrigger>
            {showAudit && <TabsTrigger value="audit">{t("users.tabs.audit")}</TabsTrigger>}
            {showLogins && <TabsTrigger value="logins">{t("users.tabs.logins")}</TabsTrigger>}
          </TabsList>

          <TabsContent value="list" className="mt-4">
            <UsersListTab />
          </TabsContent>

          {showAudit && (
            <TabsContent value="audit" className="mt-4">
              <AuditLogTab />
            </TabsContent>
          )}

          {showLogins && (
            <TabsContent value="logins" className="mt-4">
              <LoginEventsTab />
            </TabsContent>
          )}
        </Tabs>
      ) : (
        <UsersListTab />
      )}
    </div>
  );
}
