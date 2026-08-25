import type { Owner } from "@/features/pets/types";

export interface OwnerWithPets extends Owner {
  petCount: number;
  pets: { id: number; name: string }[];
}

export interface UpdateOwnerInput {
  firstName?: string;
  paternalLastName?: string;
  phone?: string;
  address?: string;
}
