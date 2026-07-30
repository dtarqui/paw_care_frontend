import { useAuth } from "@/features/auth/AuthContext";
import { Navigate, Outlet } from "react-router-dom";

export function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return null; // evita un parpadeo a /login mientras se lee localStorage

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}
