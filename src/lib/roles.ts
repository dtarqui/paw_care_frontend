import type { Role } from "@/features/auth/types";

/** Etiquetas visibles en español para cada rol del backend. */
export const ROLE_LABEL: Record<Role, string> = {
  ADMIN: "Administrador",
  VET: "Veterinario",
  RECEPTIONIST: "Recepcionista",
};

export const ROLES: { value: Role; label: string }[] = [
  { value: "ADMIN", label: "Administrador" },
  { value: "VET", label: "Veterinario" },
  { value: "RECEPTIONIST", label: "Recepcionista" },
];
