import { RouteFallback } from "@/components/RouteFallback";
import { useAuth } from "@/features/auth/AuthContext";
import { Navigate, Outlet } from "react-router-dom";

export function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth();

  // Misma razón que en ModuleRoute: acá la espera es solo leer localStorage, pero
  // "en blanco" nunca es un estado de carga válido — que lo diga la pantalla.
  if (isLoading) return <RouteFallback />;

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}
