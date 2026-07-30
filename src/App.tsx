import { AppShell } from "@/components/layout/AppShell";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AuthProvider } from "@/features/auth/AuthContext";
import { AtencionMedicaPage } from "@/pages/atencion-medica/AtencionMedicaPage";
import { CitasPage } from "@/pages/citas/CitasPage";
import { ConfiguracionPage } from "@/pages/ConfiguracionPage";
import { ControlPreventivoPage } from "@/pages/control-preventivo/ControlPreventivoPage";
import { DashboardPage } from "@/pages/DashboardPage";
import { LoginPage } from "@/pages/LoginPage";
import { MascotasPage } from "@/pages/mascotas/MascotasPage";
import { PagosPage } from "@/pages/pagos/PagosPage";
import { UsuariosPage } from "@/pages/usuarios/UsuariosPage";
import { Navigate, Route, Routes } from "react-router-dom";

export function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/app" element={<AppShell />}>
            <Route index element={<DashboardPage />} />
            <Route path="mascotas" element={<MascotasPage />} />
            <Route path="atencion-medica" element={<AtencionMedicaPage />} />
            <Route path="citas" element={<CitasPage />} />
            <Route path="control-preventivo" element={<ControlPreventivoPage />} />
            <Route path="pagos" element={<PagosPage />} />
            <Route path="usuarios" element={<UsuariosPage />} />
            <Route path="configuracion" element={<ConfiguracionPage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/app" replace />} />
      </Routes>
    </AuthProvider>
  );
}
