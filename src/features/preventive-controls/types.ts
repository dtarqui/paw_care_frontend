export type PreventiveControlType = "VACCINE" | "DEWORMING";

export interface PreventiveControl {
  id: number;
  pet: { id: number; name: string; species: string };
  type: PreventiveControlType;
  /** Qué se aplicó: la vacuna o el desparasitante. Puede faltar: los controles
   * cargados antes de que el sistema lo guardara no lo tienen. */
  productName?: string;
  /** Lote del frasco, el dato que pide el SENASAG para el certificado de viaje. */
  batchNumber?: string;
  appliedOn: string;
  nextDoseOn: string;
  overdue: boolean;
}

export interface NewPreventiveControlInput {
  petId: number;
  type: PreventiveControlType;
  productName?: string;
  batchNumber?: string;
  appliedOn: string;
  nextDoseOn?: string;
}
