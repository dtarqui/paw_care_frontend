import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClinicosTab } from "./ClinicosTab";
import { IngresosTab } from "./IngresosTab";

export function ReportesPage() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Reportes</h1>
        <p className="text-muted-foreground">Ingresos y reportes clínicos y administrativos</p>
      </div>

      <Tabs defaultValue="ingresos">
        <TabsList>
          <TabsTrigger value="ingresos">Ingresos</TabsTrigger>
          <TabsTrigger value="clinicos">Clínicos y Administrativos</TabsTrigger>
        </TabsList>

        <TabsContent value="ingresos" className="mt-4">
          <IngresosTab />
        </TabsContent>

        <TabsContent value="clinicos" className="mt-4">
          <ClinicosTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
