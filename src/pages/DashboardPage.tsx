import { ICON_MAP } from "@/components/layout/icon-map";
import { StatTile } from "@/components/StatTile";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/features/auth/AuthContext";
import { useAppointments } from "@/features/appointments/useAppointments";
import { useModules } from "@/features/dashboard/useModules";
import { usePets } from "@/features/pets/usePets";
import { usePendingPayments } from "@/features/payments/usePayments";
import { groupTitle, moduleDescription, moduleTitle } from "@/features/dashboard/labels";
import { todayISO } from "@/lib/date";
import { ArrowRight, CalendarClock, PawPrint, Wallet } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export function DashboardPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { modules, groupedModules, isLoading: loadingModules } = useModules();

  // Los ids son los del backend (dashboard.service.ts): en inglés, y "agenda" es el
  // módulo que fusiona citas + horarios.
  const moduleIds = new Set(modules.map((m) => m.id));
  const showPets = moduleIds.has("pets");
  const showAppointments = moduleIds.has("agenda");
  const showPayments = moduleIds.has("payments");

  const { data: pets, isLoading: loadingPets } = usePets(1, 1);
  const { data: appointments, isLoading: loadingAppointments } = useAppointments();
  const { data: pending, isLoading: loadingPayments } = usePendingPayments();

  const todayAppointments = appointments?.filter(
    (a) => a.dateTime.slice(0, 10) === todayISO() && a.status !== "CANCELLED"
  ).length;

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{t("dashboard.greeting", { name: user?.firstName ?? "" })}</h1>
        <p className="text-muted-foreground">
          {t("dashboard.signedInAs")}{" "}
          <span className="font-medium text-foreground">{user ? t(`enums.role.${user.role}`) : ""}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
        {showPets && (
          <StatTile label={t("dashboard.registeredPets")} value={pets?.total ?? 0} icon={PawPrint} isLoading={loadingPets} />
        )}
        {showAppointments && (
          <StatTile
            label={t("dashboard.todayAppointments")}
            value={todayAppointments ?? 0}
            icon={CalendarClock}
            isLoading={loadingAppointments}
          />
        )}
        {showPayments && (
          <StatTile
            label={t("dashboard.pendingPayments")}
            value={pending?.length ?? 0}
            icon={Wallet}
            isLoading={loadingPayments}
            tone={pending && pending.length > 0 ? "warning" : "default"}
          />
        )}
      </div>

      {loadingModules && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-[124px] rounded-xl" />
          ))}
        </div>
      )}

      {/* Mismos grupos y mismo orden que el sidebar — los define el backend. */}
      {groupedModules.map(({ group, modules: groupModules }) => (
        <div key={group.id} className="flex flex-col gap-3">
          <h2 className="text-sm font-medium text-muted-foreground">{groupTitle(t, group)}</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            {groupModules.map((module) => {
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
                      <CardTitle className="text-base">{moduleTitle(t, module)}</CardTitle>
                      <CardDescription>{moduleDescription(t, module, user?.role)}</CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
