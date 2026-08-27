import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Appointment } from "@/features/appointments/types";
import { useAuth } from "@/features/auth/AuthContext";
import { moduleDescription } from "@/features/dashboard/labels";
import { useModule } from "@/features/dashboard/useModules";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { AppointmentsListTab } from "./AppointmentsListTab";
import { NewAppointmentTab } from "./NewAppointmentTab";
import { SchedulesTab } from "./SchedulesTab";

/**
 * Agenda: citas y horarios de atención en una sola pantalla. Van juntos porque el
 * horario del veterinario es lo que determina qué bloques quedan libres al agendar
 * — tenerlos separados obligaba a saltar de pantalla para entender la disponibilidad.
 *
 * Qué pestañas se muestran lo decide el backend (`dashboard.service.ts`, campo
 * `tabs` del módulo "agenda"): una Recepcionista agenda citas pero no edita el
 * horario de los veterinarios, así que no recibe la pestaña "Horarios".
 */
export function AppointmentsPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [tab, setTab] = useState("list");
  const [appointmentBeingEdited, setAppointmentBeingEdited] = useState<Appointment | null>(null);
  const { module } = useModule("agenda");

  const availableTabs = module?.tabs ?? ["list", "new"];
  const showSchedules = availableTabs.includes("schedules");

  function handleReschedule(appointment: Appointment) {
    setAppointmentBeingEdited(appointment);
    setTab("new");
  }

  function handleTabChange(nextTab: string) {
    setTab(nextTab);
    if (nextTab !== "new") setAppointmentBeingEdited(null);
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{t("appointments.title")}</h1>
        <p className="text-muted-foreground">
          {module ? moduleDescription(t, module, user?.role) : t("appointments.subtitle")}
        </p>
      </div>

      <Tabs value={tab} onValueChange={handleTabChange}>
        <TabsList>
          <TabsTrigger value="list">{t("appointments.tabs.list")}</TabsTrigger>
          <TabsTrigger value="new">
            {appointmentBeingEdited ? t("appointments.tabs.reschedule") : t("appointments.tabs.new")}
          </TabsTrigger>
          {showSchedules && <TabsTrigger value="schedules">{t("appointments.tabs.schedules")}</TabsTrigger>}
        </TabsList>

        <TabsContent value="list" className="mt-4">
          <AppointmentsListTab onReschedule={handleReschedule} />
        </TabsContent>

        <TabsContent value="new" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <NewAppointmentTab
                appointmentBeingEdited={appointmentBeingEdited}
                onCompleted={() => {
                  setAppointmentBeingEdited(null);
                  setTab("list");
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {showSchedules && (
          <TabsContent value="schedules" className="mt-4">
            <SchedulesTab />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
