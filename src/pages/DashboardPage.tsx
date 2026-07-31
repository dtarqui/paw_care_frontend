import { ICON_MAP } from "@/components/layout/icon-map";
import { StatTile } from "@/components/StatTile";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/features/auth/AuthContext";
import { useCitas } from "@/features/citas/useCitas";
import { useModulos } from "@/features/dashboard/useModulos";
import { useMascotas } from "@/features/mascotas/useMascotas";
import { usePagosPendientes } from "@/features/pagos/usePagos";
import { todayISO } from "@/lib/date";
import { ROL_LABEL } from "@/lib/roles";
import { ArrowRight, CalendarClock, PawPrint, Wallet } from "lucide-react";
import { Link } from "react-router-dom";

export function DashboardPage() {
  const { usuario } = useAuth();
  const { data: modulos, isLoading: cargandoModulos } = useModulos();

  const moduloIds = new Set(modulos?.map((m) => m.id));
  const verMascotas = moduloIds.has("mascotas");
  const verCitas = moduloIds.has("citas");
  const verPagos = moduloIds.has("pagos");

  const { data: mascotas, isLoading: cargandoMascotas } = useMascotas(1, 1);
  const { data: citas, isLoading: cargandoCitas } = useCitas();
  const { data: pendientes, isLoading: cargandoPagos } = usePagosPendientes();

  const citasHoy = citas?.filter((c) => c.fechaHora.slice(0, 10) === todayISO() && c.estado !== "CANCELADA").length;

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Hola, {usuario?.nombre} 👋</h1>
        <p className="text-muted-foreground">
          Sesión iniciada como <span className="font-medium text-foreground">{usuario ? ROL_LABEL[usuario.rol] : ""}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {verMascotas && (
          <StatTile label="Mascotas registradas" value={mascotas?.total ?? 0} icon={PawPrint} isLoading={cargandoMascotas} />
        )}
        {verCitas && <StatTile label="Citas de hoy" value={citasHoy ?? 0} icon={CalendarClock} isLoading={cargandoCitas} />}
        {verPagos && (
          <StatTile
            label="Pagos pendientes"
            value={pendientes?.length ?? 0}
            icon={Wallet}
            isLoading={cargandoPagos}
            tone={pendientes && pendientes.length > 0 ? "warning" : "default"}
          />
        )}
      </div>

      <div className="flex flex-col gap-3">
        <h2 className="text-sm font-medium text-muted-foreground">Accesos rápidos</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cargandoModulos &&
            Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-[124px] rounded-xl" />)}

          {modulos?.map((modulo) => {
            const Icon = ICON_MAP[modulo.icono] ?? PawPrint;
            return (
              <Link key={modulo.id} to={modulo.ruta} className="group">
                <Card className="h-full gap-3 py-5 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md">
                  <CardHeader className="px-5">
                    <div className="mb-1 flex items-center justify-between">
                      <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10">
                        <Icon className="size-5 text-primary" />
                      </div>
                      <ArrowRight className="size-4 -translate-x-1 text-muted-foreground opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                    </div>
                    <CardTitle className="text-base">{modulo.titulo}</CardTitle>
                    <CardDescription>{modulo.descripcion}</CardDescription>
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
