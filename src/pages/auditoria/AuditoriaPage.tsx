import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pagination } from "@/components/Pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAuditoria } from "@/features/auditoria/useAuditoria";
import type { AccionAuditoria } from "@/features/auditoria/types";
import { History } from "lucide-react";
import { useState } from "react";

const PAGE_SIZE = 20;

const ACCION_LABEL: Record<AccionAuditoria, string> = {
  ACTIVAR_CUENTA: "Cuenta activada",
  DESACTIVAR_CUENTA: "Cuenta desactivada",
  RESTABLECER_PASSWORD: "Contraseña restablecida",
  CAMBIAR_ROL: "Rol cambiado",
  INVITAR_VETERINARIO: "Veterinario invitado",
};

const ACCION_STYLE: Record<AccionAuditoria, string> = {
  ACTIVAR_CUENTA: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400",
  DESACTIVAR_CUENTA: "bg-muted text-muted-foreground",
  RESTABLECER_PASSWORD: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400",
  CAMBIAR_ROL: "bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-400",
  INVITAR_VETERINARIO: "bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-400",
};

function formatearFechaHora(iso: string) {
  const [fecha, hora] = iso.split("T");
  const [yyyy, mm, dd] = fecha.split("-");
  return `${dd}/${mm}/${yyyy} ${hora ? hora.slice(0, 5) : ""}`.trim();
}

export function AuditoriaPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError } = useAuditoria(page, PAGE_SIZE);
  const registros = data?.registros;

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Auditoría</h1>
        <p className="text-muted-foreground">Quién hizo qué sobre otras cuentas — aprobaciones, restablecimientos de contraseña, cambios de rol e invitaciones</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Registro de acciones</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading && (
            <div className="flex flex-col gap-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          )}

          {isError && <p className="py-8 text-center text-sm text-destructive">No se pudo cargar el registro de auditoría.</p>}

          {!isLoading && !isError && registros?.length === 0 && (
            <div className="flex flex-col items-center gap-2 py-12 text-center text-muted-foreground">
              <History className="size-8" />
              <p>Todavía no hay acciones registradas.</p>
            </div>
          )}

          {!isLoading && !isError && registros && registros.length > 0 && (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Acción</TableHead>
                      <TableHead>Realizada por</TableHead>
                      <TableHead>Detalle</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {registros.map((registro) => (
                      <TableRow key={registro.id}>
                        <TableCell className="whitespace-nowrap text-sm text-muted-foreground">{formatearFechaHora(registro.fecha)}</TableCell>
                        <TableCell>
                          <Badge className={`border-none font-medium ${ACCION_STYLE[registro.accion]}`} variant="secondary">
                            {ACCION_LABEL[registro.accion] ?? registro.accion}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {registro.actor ? `${registro.actor.nombre} ${registro.actor.apellidoPaterno}` : "—"}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">{registro.detalle ?? "—"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              {data && <Pagination page={data.page} pageSize={data.pageSize} total={data.total} onPageChange={setPage} />}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
