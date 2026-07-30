import { useAuth } from "@/features/auth/AuthContext";
import { useVeterinarios } from "./useVeterinarios";

/**
 * Si el usuario autenticado es un Veterinario, devuelve su propio registro de
 * Veterinario (vinculado por usuarioId). Es la base de la restricción "un
 * veterinario solo agenda/ve su propia agenda" — Administrador y Recepcionista
 * no tienen "mi veterinario" porque no están restringidos.
 */
export function useMiVeterinario() {
  const { usuario } = useAuth();
  const { data: veterinarios, isLoading } = useVeterinarios();

  const miVeterinario =
    usuario?.rol === "VETERINARIO" ? veterinarios?.find((v) => v.usuarioId === usuario.id) : undefined;

  return { miVeterinario, isLoading };
}
