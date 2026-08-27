import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslation } from "react-i18next";
import { ClinicalTab } from "./ClinicalTab";
import { RevenueTab } from "./RevenueTab";

export function ReportsPage() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{t("reports.title")}</h1>
        <p className="text-muted-foreground">{t("reports.subtitle")}</p>
      </div>

      <Tabs defaultValue="revenue">
        <TabsList className="max-w-full overflow-x-auto">
          <TabsTrigger value="revenue">{t("reports.tabs.revenue")}</TabsTrigger>
          <TabsTrigger value="clinical">{t("reports.tabs.clinical")}</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue" className="mt-4">
          <RevenueTab />
        </TabsContent>

        <TabsContent value="clinical" className="mt-4">
          <ClinicalTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
