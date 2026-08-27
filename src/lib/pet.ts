import { todayISO } from "@/lib/date";

/** Valores que se guardan en la base. Son datos, no texto de interfaz: se
 * quedan como están y la UI los traduce con `enums.species.*` / `enums.sex.*`. */
export const SPECIES_VALUES = ["Perro", "Gato", "Otro"] as const;
export const SEX_VALUES = ["Macho", "Hembra"] as const;

export interface PetAge {
  unit: "month" | "year";
  count: number;
}

/**
 * Edad en meses hasta el primer año, en años después. Devuelve las partes y no un
 * texto ya armado: quien la muestra la traduce con `t("pets.age.month" | "pets.age.year", { count })`,
 * y así el plural lo resuelve i18next en el idioma que corresponda.
 */
export function calculateAge(birthDate: string): PetAge | null {
  if (!birthDate) return null;
  const [bYyyy, bMm, bDd] = birthDate.split("-").map(Number);
  const [tYyyy, tMm, tDd] = todayISO().split("-").map(Number);

  let months = (tYyyy - bYyyy) * 12 + (tMm - bMm);
  if (tDd < bDd) months -= 1;
  if (months < 0) return null;

  if (months < 12) return { unit: "month", count: months };
  return { unit: "year", count: Math.floor(months / 12) };
}
