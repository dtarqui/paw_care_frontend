/** Espejo de SearchResult en backend/src/services/search/searchProvider.ts.
 * `type` viene del proveedor que produjo el resultado; la UI lo traduce a ícono
 * y etiqueta, sin conocer las entidades una por una. */
export interface SearchResult {
  type: string;
  id: number;
  title: string;
  subtitle?: string;
  route: string;
}
