import { AppShell } from "@/components/layout/AppShell";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AuthProvider } from "@/features/auth/AuthContext";
import { MedicalVisitsPage } from "@/pages/medical-visits/MedicalVisitsPage";
import { AppointmentsPage } from "@/pages/appointments/AppointmentsPage";
import { SettingsPage } from "@/pages/SettingsPage";
import { PreventiveControlsPage } from "@/pages/preventive-controls/PreventiveControlsPage";
import { DashboardPage } from "@/pages/DashboardPage";
import { InfoPage } from "@/pages/info/InfoPage";
import { InventoryPage } from "@/pages/inventory/InventoryPage";
import { InvitationPage } from "@/pages/InvitationPage";
import { LoginPage } from "@/pages/LoginPage";
import { PetDetailPage } from "@/pages/pets/PetDetailPage";
import { PetsPage } from "@/pages/pets/PetsPage";
import { ForgotPasswordPage } from "@/pages/ForgotPasswordPage";
import { PaymentsPage } from "@/pages/payments/PaymentsPage";
import { OwnersPage } from "@/pages/owners/OwnersPage";
import { RemindersPage } from "@/pages/reminders/RemindersPage";
import { VetRegistrationPage } from "@/pages/VetRegistrationPage";
import { ReportsPage } from "@/pages/reports/ReportsPage";
import { ResetPasswordPage } from "@/pages/ResetPasswordPage";
import { UsersPage } from "@/pages/users/UsersPage";
import { Navigate, Route, Routes } from "react-router-dom";

export function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<VetRegistrationPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/invitation" element={<InvitationPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/app" element={<AppShell />}>
            <Route index element={<DashboardPage />} />
            <Route path="owners" element={<OwnersPage />} />
            <Route path="pets" element={<PetsPage />} />
            <Route path="pets/:id" element={<PetDetailPage />} />
            <Route path="medical-visits" element={<MedicalVisitsPage />} />
            <Route path="appointments" element={<AppointmentsPage />} />
            <Route path="preventive-controls" element={<PreventiveControlsPage />} />
            <Route path="payments" element={<PaymentsPage />} />
            <Route path="reminders" element={<RemindersPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="inventory" element={<InventoryPage />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="info" element={<InfoPage />} />
            <Route path="settings" element={<SettingsPage />} />

            {/* Horarios y Auditoría se fusionaron como pestañas de Agenda y Usuarios;
                se mantienen las rutas viejas redirigiendo para no romper enlaces. */}
            <Route path="schedules" element={<Navigate to="/app/appointments" replace />} />
            <Route path="audit-log" element={<Navigate to="/app/users" replace />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/app" replace />} />
      </Routes>
    </AuthProvider>
  );
}
