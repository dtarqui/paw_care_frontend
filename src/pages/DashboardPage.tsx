import { ICON_MAP } from "@/components/layout/icon-map";
import { StatTile } from "@/components/StatTile";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/features/auth/AuthContext";
import { useAppointments } from "@/features/appointments/useAppointments";
import { useModules } from "@/features/dashboard/useModules";
import { usePets } from "@/features/pets/usePets";
import { usePendingPayments } from "@/features/payments/usePayments";
import { todayISO } from "@/lib/date";
import { ROLE_LABEL } from "@/lib/roles";
import { ArrowRight, CalendarClock, PawPrint, Wallet } from "lucide-react";
import { Link } from "react-router-dom";

export function DashboardPage() {
  const { user } = useAuth();
  const { data: modules, isLoading: cargandoModulos } = useModules();

  const moduloIds = new Set(modules?.map((m) => m.id));
  const verMascotas = moduloIds.has("mascotas");
  const verCitas = moduloIds.has("citas");
  const verPagos = moduloIds.has("pagos");

  const { data: pets, isLoading: cargandoMascotas } = usePets(1, 1);
  const { data: appointments, isLoading: cargandoCitas } = useAppointments();
  const { data: pending, isLoading: cargandoPagos } = usePendingPayments();

  const citasHoy = appointments?.filter((c) => c.dateTime.slice(0, 10) === todayISO() && c.status !== "CANCELLED").length;

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Hola, {user?.firstName} 👋</h1>
        <p className="text-muted-foreground">
          Sesión iniciada como <span className="font-medium text-foreground">{user ? ROLE_LABEL[user.role] : ""}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {verMascotas && (
          <StatTile label="Mascotas registradas" value={pets?.total ?? 0} icon={PawPrint} isLoading={cargandoMascotas} />
        )}
        {verCitas && <StatTile label="Citas de hoy" value={citasHoy ?? 0} icon={CalendarClock} isLoading={cargandoCitas} />}
        {verPagos && (
          <StatTile
            label="Pagos pendientes"
            value={pending?.length ?? 0}
            icon={Wallet}
            isLoading={cargandoPagos}
            tone={pending && pending.length > 0 ? "warning" : "default"}
          />
        )}
      </div>

      <div className="flex flex-col gap-3">
        <h2 className="text-sm font-medium text-muted-foreground">Accesos rápidos</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cargandoModulos &&
            Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-[124px] rounded-xl" />)}

          {modules?.map((module) => {
            const Icon = ICON_MAP[module.icon] ?? PawPrint;
            return (
              <Link key={module.id} to={module.route} className="group">
                <Card className="h-full gap-3 py-5 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md">
                  <CardHeader className="px-5">
                    <div className="mb-1 flex items-center justify-between">
                      <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10">
                        <Icon className="size-5 text-primary" />
                      </div>
                      <ArrowRight className="size-4 -translate-x-1 text-muted-foreground opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                    </div>
                    <CardTitle className="text-base">{module.title}</CardTitle>
                    <CardDescription>{module.description}</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
