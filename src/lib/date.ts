/** Fecha local del navegador en formato YYYY-MM-DD (no UTC). */
export function todayISO(): string {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

/** Parte de fecha de un literal `YYYY-MM-DD` o `YYYY-MM-DDTHH:mm`, sin pasar por
 * `new Date(string)` — que interpreta el literal como UTC y corre un día. */
function parts(iso: string) {
  const [date, time] = iso.split("T");
  const [yyyy, mm, dd] = date.split("-").map(Number);
  return { yyyy, mm, dd, hhmm: time ? time.slice(0, 5) : "" };
}

/**
 * En español se usa el `dd/mm/aaaa` de siempre. En inglés el mes va abreviado
 * (`04 Mar 2026`) a propósito: `03/04` significa cosas distintas según el país, y
 * en una ficha clínica esa ambigüedad no es aceptable.
 */
const OPTIONS: Record<string, Intl.DateTimeFormatOptions> = {
  es: { day: "2-digit", month: "2-digit", year: "numeric" },
  en: { day: "2-digit", month: "short", year: "numeric" },
};

const SHORT_OPTIONS: Record<string, Intl.DateTimeFormatOptions> = {
  es: { day: "2-digit", month: "2-digit" },
  en: { day: "2-digit", month: "short" },
};

function localeOf(language: string) {
  return language.startsWith("en") ? "en-GB" : "es-BO";
}

function optionsOf(language: string, short: boolean) {
  const table = short ? SHORT_OPTIONS : OPTIONS;
  return table[language.startsWith("en") ? "en" : "es"];
}

export function formatDate(iso: string, language: string): string {
  if (!iso) return "—";
  const { yyyy, mm, dd } = parts(iso);
  return new Intl.DateTimeFormat(localeOf(language), optionsOf(language, false)).format(
    new Date(yyyy, mm - 1, dd)
  );
}

/** Día y mes, para ejes de gráficos y listados densos. */
export function formatShortDate(iso: string, language: string): string {
  if (!iso) return "—";
  const { yyyy, mm, dd } = parts(iso);
  return new Intl.DateTimeFormat(localeOf(language), optionsOf(language, true)).format(
    new Date(yyyy, mm - 1, dd)
  );
}

export function formatDateTime(iso: string, language: string): string {
  if (!iso) return "—";
  const { hhmm } = parts(iso);
  const date = formatDate(iso, language);
  return hhmm ? `${date} ${hhmm}` : date;
}
