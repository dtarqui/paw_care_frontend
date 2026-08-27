/** Compartido entre Citas (consultationType) y Atención Médica (serviceType) — mismo
 * catálogo, se usa para agrupar los reportes financieros por tipo de servicio.
 *
 * Los valores se guardan en español porque son **datos**, no texto de interfaz: ya
 * están escritos así en la base y en los reportes históricos. La UI los traduce con
 * `enums.serviceType.*`, cayendo al valor crudo si alguien cargó uno a mano. */
export const SERVICE_TYPES = ["Consulta General", "Vacunación", "Control", "Cirugía", "Desparasitación"];
