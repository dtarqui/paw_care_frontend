export type ModuleGroupId = "clients" | "clinic" | "admin" | "system";

export interface ModuleGroup {
  id: ModuleGroupId;
  title: string; // texto visible, en español
}

export interface DashboardModule {
  id: string;
  title: string; // texto visible, en español
  description: string; // idem
  route: string;
  icon: string;
  group: ModuleGroupId;
  /** Sub-secciones disponibles dentro del módulo (pantallas con pestañas).
   * Viene del backend para no reconstruir una tabla de permisos por rol acá. */
  tabs?: string[];
}

export interface DashboardModulesResponse {
  modules: DashboardModule[];
  groups: ModuleGroup[];
}
