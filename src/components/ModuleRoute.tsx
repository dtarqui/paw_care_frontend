import { useModules } from "@/features/dashboard/useModules";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { toast } from "sonner";

/**
 * Impide entrar a un módulo que el rol no tiene, aunque se escriba la URL a mano.
 *
 * El sidebar ya oculta lo que no corresponde, pero **ocultar no es impedir**: un
 * veterinario que escribía `/app/users` veía la pantalla de Usuarios entera, con sus
 * pestañas y los botones «Nuevo usuario» e «Invitar veterinario». El backend
 * rechazaba cada llamada con 403 —eso siempre funcionó—, pero ofrecerle acciones de
 * administrador a quien no lo es no se sostiene, ni siquiera cuando no llevan a nada.
 *
 * El permiso sale de la **misma fuente que el sidebar** (`GET /api/dashboard/modules`,
 * `backend/src/services/dashboard.service.ts`), no de una tabla de roles acá: agregar
 * un módulo o cambiar quién lo ve sigue siendo editar ese mapa y nada más.
 *
 * Si la consulta de módulos falla se deja pasar: el backend sigue siendo el guarda de
 * verdad, y dejar la aplicación entera inaccesible por una red intermitente es peor
 * que mostrar una pantalla que no va a poder cargar datos.
 */

/** El tablero: no es un módulo del mapa, es donde caen todos. */
const DASHBOARD = "/app";

export function ModuleRoute() {
  const { pathname } = useLocation();
  const { t } = useTranslation();
  const { modules, isLoading, isError } = useModules();

  const allowed =
    pathname === DASHBOARD ||
    modules.some((module) => pathname === module.route || pathname.startsWith(`${module.route}/`));
  const blocked = !isLoading && !isError && !allowed;

  useEffect(() => {
    if (blocked) toast.error(t("errors.moduleForbidden"));
  }, [blocked, t]);

  if (isLoading) return null; // evita un parpadeo de la pantalla antes de saber si toca
  if (isError) return <Outlet />;

  return allowed ? <Outlet /> : <Navigate to={DASHBOARD} replace />;
}
