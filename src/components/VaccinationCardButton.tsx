import { Button } from "@/components/ui/button";
import { preventiveControlsApi } from "@/features/preventive-controls/api";
import { IdCard, Loader2 } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

/**
 * Descarga el carnet de vacunación de una mascota. Está en dos lugares —la ficha de
 * la mascota y la pantalla de controles preventivos— porque es el papel que el dueño
 * pide en el mostrador, y ahí no hay tiempo de buscar en qué pantalla estaba.
 *
 * El tamaño de hoja sale de la configuración del dispositivo (`features/print`), no
 * de un menú acá: quien imprime ya lo eligió una vez para todo lo que sale por esa
 * impresora.
 */
export function VaccinationCardButton({ pet }: { pet: { id: number; name: string } }) {
  const { t } = useTranslation();
  const [downloading, setDownloading] = useState(false);

  async function download() {
    setDownloading(true);
    try {
      await preventiveControlsApi.downloadCard(pet);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("preventive.card.downloadError"));
    } finally {
      setDownloading(false);
    }
  }

  return (
    <Button variant="outline" onClick={download} disabled={downloading}>
      {downloading ? <Loader2 className="size-4 animate-spin" /> : <IdCard className="size-4" />}
      {t("preventive.card.download")}
    </Button>
  );
}
