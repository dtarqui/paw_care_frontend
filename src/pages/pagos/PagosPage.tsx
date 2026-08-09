import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useHistorialPagos, usePagosPendientes } from "@/features/pagos/usePagos";
import type { PagoPendiente } from "@/features/pagos/types";
import { History, Wallet } from "lucide-react";
import { useState } from "react";
import { CobroQrDialog } from "./CobroQrDialog";
import { RegistrarPagoDialog } from "./RegistrarPagoDialog";

function formatearFecha(iso: string) {
  const [fecha] = iso.split("T");
  const [yyyy, mm, dd] = fecha.split("-");
  return `${dd}/${mm}/${yyyy}`;
}

const METODO_LABEL: Record<string, string> = {
  EFECTIVO: "Efectivo",
  TARJETA: "Tarjeta",
  TRANSFERENCIA: "Transferencia",
  QR: "QR",
};

export function PagosPage() {
  const { data: pendientes, isLoading, isError } = usePagosPendientes();
  const { data: historial, isLoading: cargandoHistorial } = useHistorialPagos(5);
  const [seleccionado, setSeleccionado] = useState<PagoPendiente | null>(null);
  const [seleccionadoQr, setSeleccionadoQr] = useState<PagoPendiente | null>(null);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Pagos</h1>
        <p className="text-muted-foreground">Atenciones pendientes de cobro</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Pendientes de pago</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading && (
            <div className="flex flex-col gap-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          )}

          {isError && (
            <p className="py-8 text-center text-sm text-destructive">No se pudo cargar la lista de pagos.</p>
          )}

          {!isLoading && !isError && pendientes?.length === 0 && (
            <div className="flex flex-col items-center gap-2 py-12 text-center text-muted-foreground">
              <Wallet className="size-8" />
              <p>No hay pagos pendientes. Todo al día.</p>
            </div>
          )}

          {!isLoading && !isError && pendientes && pendientes.length > 0 && (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mascota</TableHead>
                    <TableHead>Propietario</TableHead>
                    <TableHead>Motivo</TableHead>
                    <TableHead>Monto</TableHead>
                    <TableHead className="text-right">Acción</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendientes.map((pendiente) => (
                    <TableRow key={pendiente.atencionId}>
                      <TableCell className="font-medium">{pendiente.mascota.nombre}</TableCell>
                      <TableCell>
                        {pendiente.propietario.nombre} {pendiente.propietario.apellidoPaterno}
                      </TableCell>
                      <TableCell>{pendiente.motivoConsulta}</TableCell>
                      <TableCell>Bs. {pendiente.monto.toFixed(2)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button size="sm" variant="outline" onClick={() => setSeleccionadoQr(pendiente)}>
                            Cobrar con QR
                          </Button>
                          <Button size="sm" onClick={() => setSeleccionado(pendiente)}>
                            Registrar pago
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Últimos pagos</CardTitle>
        </CardHeader>
        <CardContent>
          {cargandoHistorial && (
            <div className="flex flex-col gap-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          )}

          {!cargandoHistorial && historial?.length === 0 && (
            <div className="flex flex-col items-center gap-2 py-8 text-center text-muted-foreground">
              <History className="size-7" />
              <p>Todavía no hay pagos registrados.</p>
            </div>
          )}

          {!cargandoHistorial && historial && historial.length > 0 && (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mascota</TableHead>
                    <TableHead>Propietario</TableHead>
                    <TableHead>Monto</TableHead>
                    <TableHead>Método</TableHead>
                    <TableHead>Fecha</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {historial.map((pago) => (
                    <TableRow key={pago.id}>
                      <TableCell className="font-medium">{pago.mascota.nombre}</TableCell>
                      <TableCell>
                        {pago.propietario.nombre} {pago.propietario.apellidoPaterno}
                      </TableCell>
                      <TableCell>Bs. {pago.monto.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="border-none font-normal">
                          {METODO_LABEL[pago.metodoPago] ?? pago.metodoPago}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatearFecha(pago.fecha)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <RegistrarPagoDialog pendiente={seleccionado} onClose={() => setSeleccionado(null)} />
      <CobroQrDialog pendiente={seleccionadoQr} onClose={() => setSeleccionadoQr(null)} />
    </div>
  );
}
