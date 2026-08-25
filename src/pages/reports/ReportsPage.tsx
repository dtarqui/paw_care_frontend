import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClinicalTab } from "./ClinicalTab";
import { RevenueTab } from "./RevenueTab";

export function ReportsPage() {
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
          <RevenueTab />
        </TabsContent>

        <TabsContent value="clinicos" className="mt-4">
          <ClinicalTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
