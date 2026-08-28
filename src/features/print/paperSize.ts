import { useState } from "react";

/**
 * Tamaño de papel de lo que se imprime y se entrega en mano: el comprobante de pago
 * y el carnet de vacunación.
 *
 * Se guarda **por dispositivo** (localStorage), no por usuario: la impresora está
 * enchufada a una computadora concreta, así que el mostrador con la impresora de
 * tickets y la oficina con la de hojas necesitan valores distintos aunque entre la
 * misma persona. Es el mismo criterio que el tema y el acento de marca, que la
 * pantalla de Configuración ya presenta como ajustes "de este dispositivo".
 *
 * El valor viaja al backend como `?paper=`, que lo valida contra su propia lista
 * (`utils/paperSize.ts`) y cae al tamaño por defecto si no lo reconoce — así un
 * localStorage viejo o manipulado nunca rompe una descarga.
 */
export const PAPER_SIZES = [
  { value: "half-letter", hint: "14 × 21.6 cm" },
  { value: "letter", hint: "21.6 × 27.9 cm" },
  { value: "a4", hint: "21 × 29.7 cm" },
  { value: "ticket-80mm", hint: "80 mm" },
] as const;

export type PaperSize = (typeof PAPER_SIZES)[number]["value"];

/** Media carta: el tamaño natural de un recibo o un carnet, sin desperdiciar media hoja. */
export const DEFAULT_PAPER_SIZE: PaperSize = "half-letter";

const STORAGE_KEY = "pawcare.paper-size";

function readStoredPaperSize(): PaperSize {
  const stored = localStorage.getItem(STORAGE_KEY);
  return PAPER_SIZES.some((size) => size.value === stored) ? (stored as PaperSize) : DEFAULT_PAPER_SIZE;
}

/**
 * El fragmento de query que va pegado a la URL de descarga. Se lee en el momento de
 * bajar el archivo, no cuando se monta la pantalla: si alguien cambia el tamaño en
 * Configuración, la siguiente descarga ya sale con el nuevo sin recargar nada.
 */
export function paperQuery(): string {
  return `?paper=${readStoredPaperSize()}`;
}

export function usePaperSize() {
  const [paperSize, setState] = useState<PaperSize>(readStoredPaperSize);

  function setPaperSize(size: PaperSize) {
    localStorage.setItem(STORAGE_KEY, size);
    setState(size);
  }

  return { paperSize, setPaperSize };
}
