import { useAuth } from "@/features/auth/AuthContext";
import { useVets } from "./useVets";

/**
 * Si el usuario autenticado es un Veterinario, devuelve su propio registro de
 * Vet (vinculado por userId). Es la base de la restricción "un
 * veterinario solo agenda/ve su propia agenda" — Administrador y Recepcionista
 * no tienen "mi veterinario" porque no están restringidos.
 */
export function useMyVet() {
  const { user } = useAuth();
  const { data: vets, isLoading } = useVets();

  const myVet = user?.role === "VET" ? vets?.find((v) => v.userId === user.id) : undefined;

  return { myVet, isLoading };
}
