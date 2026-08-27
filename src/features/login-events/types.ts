import type { Role } from "@/features/auth/types";

export type LoginOutcome = "SUCCESS" | "INVALID_CREDENTIALS" | "INACTIVE_ACCOUNT";

/** Un intento de inicio de sesión, exitoso o no. */
export interface LoginEvent {
  id: number;
  /** Ausente cuando el nombre de usuario tecleado no existe. */
  user?: { firstName: string; paternalLastName: string; role: Role };
  username: string;
  outcome: LoginOutcome;
  ipAddress?: string;
  userAgent?: string;
  date: string;
}

/** Qué se muestra en la lista: todo, solo ingresos, o solo intentos fallidos. */
export type LoginEventFilter = "all" | "success" | "failed";
