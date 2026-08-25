export type PreventiveControlType = "VACCINE" | "DEWORMING";

export interface PreventiveControl {
  id: number;
  pet: { id: number; name: string; species: string };
  type: PreventiveControlType;
  appliedOn: string;
  nextDoseOn: string;
  overdue: boolean;
}

export interface NewPreventiveControlInput {
  petId: number;
  type: PreventiveControlType;
  appliedOn: string;
  nextDoseOn?: string;
}
