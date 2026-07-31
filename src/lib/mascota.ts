import { todayISO } from "@/lib/date";

export function calcularEdad(fechaNacimiento: string): string | null {
  if (!fechaNacimiento) return null;
  const [nYyyy, nMm, nDd] = fechaNacimiento.split("-").map(Number);
  const [hYyyy, hMm, hDd] = todayISO().split("-").map(Number);

  let meses = (hYyyy - nYyyy) * 12 + (hMm - nMm);
  if (hDd < nDd) meses -= 1;
  if (meses < 0) return null;

  if (meses < 12) return `${meses} ${meses === 1 ? "mes" : "meses"}`;
  const anios = Math.floor(meses / 12);
  return `${anios} ${anios === 1 ? "año" : "años"}`;
}
