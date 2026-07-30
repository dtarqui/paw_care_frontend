import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Cita } from "@/features/citas/types";
import { useState } from "react";
import { CitasListaTab } from "./CitasListaTab";
import { NuevaCitaTab } from "./NuevaCitaTab";

export function CitasPage() {
  const [tab, setTab] = useState("lista");
  const [citaEnEdicion, setCitaEnEdicion] = useState<Cita | null>(null);

  function handleReprogramar(cita: Cita) {
    setCitaEnEdicion(cita);
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
          <TabsTrigger value="nueva">{citaEnEdicion ? "Reprogramar Cita" : "Nueva Cita"}</TabsTrigger>
        </TabsList>

        <TabsContent value="lista" className="mt-4">
          <CitasListaTab onReprogramar={handleReprogramar} />
        </TabsContent>

        <TabsContent value="nueva" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <NuevaCitaTab
                citaEnEdicion={citaEnEdicion}
                onCompletado={() => {
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
