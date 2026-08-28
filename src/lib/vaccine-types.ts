/**
 * Sugerencias para el campo «vacuna» del control preventivo: lo que se aplica
 * habitualmente en una clínica en Bolivia, canino y felino.
 *
 * Es una **sugerencia, no un catálogo cerrado** — el campo sigue siendo texto libre y
 * se ofrece con un `<datalist>`. Una clínica usa la marca que consiguió ese mes, y
 * encerrarla en una lista fija llevaría a elegir "la más parecida", que es peor dato
 * que el que se teclea a mano.
 *
 * Los valores se guardan en español porque son **datos**, no texto de interfaz, igual
 * que `SERVICE_TYPES` y que la especie o el sexo de la mascota.
 */
export const VACCINE_SUGGESTIONS = [
  "Antirrábica",
  "Quíntuple canina",
  "Séxtuple canina",
  "Tos de las perreras (KC)",
  "Triple felina",
  "Leucemia felina",
];

/** Los desparasitantes se nombran por marca y no hay un puñado estándar, así que acá
 * la sugerencia sería adivinar: el campo queda libre. */
export const DEWORMER_SUGGESTIONS: string[] = [];
