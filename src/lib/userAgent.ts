/**
 * Resume un user agent en algo legible ("Chrome · Windows").
 *
 * Es una aproximación a propósito: los user agents mienten por diseño —Edge dice ser
 * Chrome, Chrome dice ser Safari— y reconocerlos con exactitud requeriría una
 * biblioteca entera. Para la pregunta que responde esta pantalla ("¿esto lo hizo
 * alguien del mostrador o vino de otro lado?") alcanza con el navegador y el sistema.
 * El texto completo queda igual guardado y se muestra al pasar el mouse.
 */
const BROWSERS: [RegExp, string][] = [
  [/\bEdg\//, "Edge"],
  [/\bOPR\/|\bOpera\b/, "Opera"],
  [/\bSamsungBrowser\//, "Samsung Internet"],
  [/\bFirefox\//, "Firefox"],
  [/\bChrome\//, "Chrome"],
  [/\bSafari\//, "Safari"],
];

const SYSTEMS: [RegExp, string][] = [
  [/\bWindows NT\b/, "Windows"],
  [/\bAndroid\b/, "Android"],
  [/\b(iPhone|iPad|iPod)\b/, "iOS"],
  [/\bMac OS X\b/, "macOS"],
  [/\bLinux\b/, "Linux"],
];

function match(table: [RegExp, string][], agent: string): string | undefined {
  return table.find(([pattern]) => pattern.test(agent))?.[1];
}

export function summarizeUserAgent(agent?: string): string | undefined {
  if (!agent) return undefined;
  const parts = [match(BROWSERS, agent), match(SYSTEMS, agent)].filter(Boolean);
  // Si no se reconoce nada, es mejor el texto crudo recortado que un "Desconocido".
  return parts.length > 0 ? parts.join(" · ") : agent.slice(0, 40);
}
