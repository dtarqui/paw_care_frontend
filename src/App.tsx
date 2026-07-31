import { AppShell } from "@/components/layout/AppShell";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AuthProvider } from "@/features/auth/AuthContext";
import { AtencionMedicaPage } from "@/pages/atencion-medica/AtencionMedicaPage";
import { CitasPage } from "@/pages/citas/CitasPage";
import { ConfiguracionPage } from "@/pages/ConfiguracionPage";
import { ControlPreventivoPage } from "@/pages/control-preventivo/ControlPreventivoPage";
import { DashboardPage } from "@/pages/DashboardPage";
import { HorariosPage } from "@/pages/horarios/HorariosPage";
import { InventarioPage } from "@/pages/inventario/InventarioPage";
import { LoginPage } from "@/pages/LoginPage";
import { MascotaDetallePage } from "@/pages/mascotas/MascotaDetallePage";
import { MascotasPage } from "@/pages/mascotas/MascotasPage";
import { PagosPage } from "@/pages/pagos/PagosPage";
import { PropietariosPage } from "@/pages/propietarios/PropietariosPage";
import { RecordatoriosPage } from "@/pages/recordatorios/RecordatoriosPage";
import { RegistroVeterinarioPage } from "@/pages/RegistroVeterinarioPage";
import { ReportesPage } from "@/pages/reportes/ReportesPage";
import { UsuariosPage } from "@/pages/usuarios/UsuariosPage";
import { Navigate, Route, Routes } from "react-router-dom";

export function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/registro" element={<RegistroVeterinarioPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/app" element={<AppShell />}>
            <Route index element={<DashboardPage />} />
            <Route path="propietarios" element={<PropietariosPage />} />
            <Route path="mascotas" element={<MascotasPage />} />
            <Route path="mascotas/:id" element={<MascotaDetallePage />} />
            <Route path="atencion-medica" element={<AtencionMedicaPage />} />
            <Route path="citas" element={<CitasPage />} />
            <Route path="control-preventivo" element={<ControlPreventivoPage />} />
            <Route path="pagos" element={<PagosPage />} />
            <Route path="recordatorios" element={<RecordatoriosPage />} />
            <Route path="reportes" element={<ReportesPage />} />
            <Route path="inventario" element={<InventarioPage />} />
            <Route path="usuarios" element={<UsuariosPage />} />
            <Route path="horarios" element={<HorariosPage />} />
            <Route path="configuracion" element={<ConfiguracionPage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/app" replace />} />
      </Routes>
    </AuthProvider>
  );
}
