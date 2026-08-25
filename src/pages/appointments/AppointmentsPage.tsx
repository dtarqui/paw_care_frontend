import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Appointment } from "@/features/appointments/types";
import { useState } from "react";
import { AppointmentsListTab } from "./AppointmentsListTab";
import { NewAppointmentTab } from "./NewAppointmentTab";

export function AppointmentsPage() {
  const [tab, setTab] = useState("lista");
  const [appointmentBeingEdited, setCitaEnEdicion] = useState<Appointment | null>(null);

  function handleReprogramar(appointment: Appointment) {
    setCitaEnEdicion(appointment);
    setTab("nueva");
  }

  function handleTabChange(nuevoTab: string) {
    setTab(nuevoTab);
    if (nuevoTab === "lista") setCitaEnEdicion(null);
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Citas</h1>
        <p className="text-muted-foreground">Gestión de citas médicas</p>
      </div>

      <Tabs value={tab} onValueChange={handleTabChange}>
        <TabsList>
          <TabsTrigger value="lista">Lista de Citas</TabsTrigger>
          <TabsTrigger value="nueva">{appointmentBeingEdited ? "Reprogramar Cita" : "Nueva Cita"}</TabsTrigger>
        </TabsList>

        <TabsContent value="lista" className="mt-4">
          <AppointmentsListTab onReprogramar={handleReprogramar} />
        </TabsContent>

        <TabsContent value="nueva" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <NewAppointmentTab
                appointmentBeingEdited={appointmentBeingEdited}
                onCompleted={() => {
                  setCitaEnEdicion(null);
                  setTab("lista");
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
