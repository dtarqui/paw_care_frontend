import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import en from "./locales/en.json";
import es from "./locales/es.json";

/** Los dos únicos idiomas del producto. El español es el idioma base: es el que
 * habla la clínica, y es el que se escribe primero cuando se agrega una pantalla. */
export const LANGUAGES = [
  { value: "es", label: "Español" },
  { value: "en", label: "English" },
] as const;

export type Language = (typeof LANGUAGES)[number]["value"];

export const DEFAULT_LANGUAGE: Language = "es";
export const LANGUAGE_STORAGE_KEY = "pawcare.language";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      es: { translation: es },
      en: { translation: en },
    },
    fallbackLng: DEFAULT_LANGUAGE,
    supportedLngs: LANGUAGES.map((l) => l.value),
    // "es-BO" o "en-US" deben resolver a "es" / "en" y no a un recurso inexistente.
    load: "languageOnly",
    nonExplicitSupportedLngs: true,
    detection: {
      order: ["localStorage", "navigator"],
      lookupLocalStorage: LANGUAGE_STORAGE_KEY,
      caches: ["localStorage"],
    },
    interpolation: {
      // React ya escapa lo que interpola en JSX.
      escapeValue: false,
    },
  });

/** El atributo `lang` del documento importa para el lector de pantalla y para la
 * separación silábica del navegador, así que sigue al idioma elegido. */
function syncDocumentLanguage(language: string) {
  document.documentElement.lang = language.split("-")[0];
}

syncDocumentLanguage(i18n.language || DEFAULT_LANGUAGE);
i18n.on("languageChanged", syncDocumentLanguage);

export default i18n;
