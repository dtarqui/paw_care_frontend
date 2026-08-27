import { formatDate, formatDateTime, formatShortDate } from "@/lib/date";
import { useTranslation } from "react-i18next";

/**
 * Formateadores de fecha ya atados al idioma actual, para no repetir
 * `formatDate(iso, i18n.language)` en cada pantalla. Antes cada listado traía su
 * propia función `formatDate` con el `dd/mm/aaaa` escrito a mano: eran 13 copias,
 * y ninguna podía cambiar de idioma.
 */
export function useFormatters() {
  const { i18n } = useTranslation();
  const language = i18n.resolvedLanguage ?? i18n.language;

  return {
    language,
    formatDate: (iso: string) => formatDate(iso, language),
    formatShortDate: (iso: string) => formatShortDate(iso, language),
    formatDateTime: (iso: string) => formatDateTime(iso, language),
  };
}
