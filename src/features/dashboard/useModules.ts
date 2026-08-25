import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "./api";
import type { DashboardModule, ModuleGroup } from "./types";

/** Módulos del rol actual, ya agrupados y en el orden que define el backend. */
export function useModules() {
  const query = useQuery({
    queryKey: ["dashboard", "modules"],
    queryFn: () => dashboardApi.modules(),
  });

  const modules: DashboardModule[] = query.data?.modules ?? [];
  const groups: ModuleGroup[] = query.data?.groups ?? [];

  const groupedModules = groups
    .map((group) => ({ group, modules: modules.filter((m) => m.group === group.id) }))
    .filter((section) => section.modules.length > 0);

  return { ...query, modules, groups, groupedModules };
}

/** Devuelve el módulo por id — lo usan las pantallas con pestañas para saber
 * cuáles mostrar según el rol (la lista la manda el backend). */
export function useModule(id: string) {
  const { modules, isLoading } = useModules();
  return { module: modules.find((m) => m.id === id), isLoading };
}
