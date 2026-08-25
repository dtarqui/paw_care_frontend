import type { MedicalVisit } from "../medical-visits/types";
import type { Appointment } from "../appointments/types";
import type { PreventiveControl } from "../preventive-controls/types";

export interface Owner {
  id: number;
  firstName: string;
  paternalLastName: string;
  nationalId: string;
  phone: string;
  address?: string;
}

export interface Pet {
  id: number;
  name: string;
  species: string;
  breed: string;
  sex: "Macho" | "Hembra";
  birthDate: string;
  weight: number;
  status: "ACTIVE" | "INACTIVE";
  owner: Owner;
}

export interface NewPetInput {
  name: string;
  species: string;
  breed?: string;
  sex: "Macho" | "Hembra";
  birthDate?: string;
  weight?: number;
  owner: {
    nationalId: string;
    firstName?: string;
    paternalLastName?: string;
    phone?: string;
  };
}

export interface UpdatePetInput {
  name?: string;
  species?: string;
  breed?: string;
  sex?: "Macho" | "Hembra";
  birthDate?: string;
  weight?: number;
}

export interface PetChange {
  id: number;
  field: string;
  oldValue?: string;
  newValue?: string;
  date: string;
  user?: string;
}

// Ficha individual de mascota: línea de tiempo unificada. Espejo exacto de
// PetHistoryEvent en backend/src/types.ts.
export type PetHistoryEvent =
  | { type: "VISIT"; date: string; visit: MedicalVisit }
  | { type: "PREVENTIVE_CONTROL"; date: string; control: PreventiveControl }
  | { type: "APPOINTMENT"; date: string; appointment: Appointment }
  | { type: "CHANGE"; date: string; change: PetChange };
