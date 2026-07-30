import type { Rol } from "@/features/auth/types";

export const ROL_LABEL: Record<Rol, string> = {
  ADMINISTRADOR: "Administrador",
  VETERINARIO: "Veterinario",
  RECEPCIONISTA: "Recepcionista",
};

export const ROLES: { value: Rol; label: string }[] = [
  { value: "ADMINISTRADOR", label: "Administrador" },
  { value: "VETERINARIO", label: "Veterinario" },
  { value: "RECEPCIONISTA", label: "Recepcionista" },
];
