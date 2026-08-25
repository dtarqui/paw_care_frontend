import { todayISO } from "@/lib/date";

/** Devuelve la edad ya formateada en español para mostrar en la UI. */
export function calculateAge(birthDate: string): string | null {
  if (!birthDate) return null;
  const [bYyyy, bMm, bDd] = birthDate.split("-").map(Number);
  const [tYyyy, tMm, tDd] = todayISO().split("-").map(Number);

  let months = (tYyyy - bYyyy) * 12 + (tMm - bMm);
  if (tDd < bDd) months -= 1;
  if (months < 0) return null;

  if (months < 12) return `${months} ${months === 1 ? "mes" : "meses"}`;
  const years = Math.floor(months / 12);
  return `${years} ${years === 1 ? "año" : "años"}`;
}
