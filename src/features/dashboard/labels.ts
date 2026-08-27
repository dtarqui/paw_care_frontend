import type { Role } from "@/features/auth/types";
import type { DashboardModule, ModuleGroup } from "./types";
import type { TFunction } from "i18next";

/** El backend decide **qué** módulos ve cada rol y en qué orden; el texto visible
 * lo pone el frontend, para que siga al idioma elegido. Los títulos en español que
 * manda el backend quedan como red de seguridad (`defaultValue`): si algún día se
 * agrega un módulo y falta su traducción, se ve el texto del servidor en vez de la
 * clave cruda.
 *
 * Varias descripciones cambian según el rol (la Agenda de un Veterinario es "tus
 * citas"; la de Recepción, "agendar y reprogramar"), así que se busca primero la
 * variante por rol y se cae a la genérica. */
export function moduleTitle(t: TFunction, module: DashboardModule): string {
  return t(`nav.modules.${module.id}.title`, { defaultValue: module.title });
}

export function moduleDescription(t: TFunction, module: DashboardModule, role?: Role): string {
  const keys = role
    ? [`nav.modules.${module.id}.description.${role}`, `nav.modules.${module.id}.description.default`]
    : [`nav.modules.${module.id}.description.default`];
  return t(keys, { defaultValue: module.description });
}

export function groupTitle(t: TFunction, group: ModuleGroup): string {
  return t(`nav.groups.${group.id}`, { defaultValue: group.title });
}
