import type { Role } from "@/features/auth/types";

/** El orden en que se ofrecen los roles en los selectores. Las etiquetas visibles
 * viven en las traducciones (`enums.role.*`), no acá: la UI las resuelve con
 * `t(\`enums.role.${role}\`)` para que sigan al idioma elegido. */
export const ROLE_VALUES: Role[] = ["ADMIN", "VET", "RECEPTIONIST"];
