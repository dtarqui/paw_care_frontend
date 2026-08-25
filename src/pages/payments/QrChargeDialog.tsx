import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useQrCharge, useGenerateQrCharge } from "@/features/payments/usePayments";
import type { PendingPayment } from "@/features/payments/types";
import { useQueryClient } from "@tanstack/react-query";
import { AlertTriangle, CheckCircle2, Loader2, QrCode } from "lucide-react";
import { useEffect, useState } from "react";

interface CobroQrDialogProps {
  pendiente: PendingPayment | null;
  onClose: () => void;
}

/** Muestra el QR generado por el banco y hace polling (cada 3s, ver useCobroQr) hasta
 * que se confirme, expire o falle — no hay websockets en el proyecto, así que no hay
 * forma de que el banco "avise" al frontend salvo preguntando periódicamente. */
export function QrChargeDialog({ pendiente, onClose }: CobroQrDialogProps) {
  const queryClient = useQueryClient();
  const generarCobroQr = useGenerateQrCharge();
  const [cobroId, setCobroId] = useState<number | null>(null);
  const [errorGeneracion, setErrorGeneracion] = useState<string | null>(null);
  const { data: charge } = useQrCharge(cobroId);

  useEffect(() => {
    if (!pendiente) {
      setCobroId(null);
      setErrorGeneracion(null);
      return;
    }
    setErrorGeneracion(null);
    generarCobroQr.mutate(pendiente.visitId, {
      onSuccess: (data) => setCobroId(data.charge.id),
      onError: (err) => setErrorGeneracion(err instanceof Error ? err.message : "No se pudo generar el cobro QR"),
    });
    // Solo debe re-disparar cuando cambia la atención seleccionada, no en cada render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendiente?.visitId]);

  useEffect(() => {
    if (charge?.status === "CONFIRMED") {
      queryClient.invalidateQueries({ queryKey: ["pagos", "pendientes"] });
      queryClient.invalidateQueries({ queryKey: ["pagos", "historial"] });
    }
  }, [charge?.status, queryClient]);

  if (!pendiente) return null;

  function handleClose() {
    setCobroId(null);
    setErrorGeneracion(null);
    onClose();
  }

  return (
    <Dialog open={!!pendiente} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cobrar con QR</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="rounded-md border bg-muted/40 p-3 text-sm">
            <p className="font-medium">{pendiente.pet.name}</p>
            <p className="text-muted-foreground">
              {pendiente.owner.firstName} {pendiente.owner.paternalLastName} — Bs. {pendiente.amount.toFixed(2)}
            </p>
          </div>

          {generarCobroQr.isPending && (
            <div className="flex flex-col items-center gap-2 py-8 text-center text-muted-foreground">
              <Loader2 className="size-6 animate-spin" />
              <p>Generando QR con el banco...</p>
            </div>
          )}

          {errorGeneracion && (
            <div className="flex flex-col items-center gap-2 py-8 text-center">
              <AlertTriangle className="size-8 text-destructive" />
              <p className="text-sm text-destructive">{errorGeneracion}</p>
            </div>
          )}

          {charge?.status === "PENDING" && (
            <div className="flex flex-col items-center gap-3 py-4 text-center">
              {charge.qrPayload?.startsWith("http") ? (
                <img src={charge.qrPayload} alt="Código QR de pago" className="size-48 rounded-md border" />
              ) : (
                <div className="flex size-48 flex-col items-center justify-center gap-2 rounded-md border bg-muted/40 p-4">
                  <QrCode className="size-8 text-muted-foreground" />
                  <code className="break-all text-xs text-muted-foreground">{charge.qrPayload}</code>
                </div>
              )}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="size-4 animate-spin" />
                Esperando confirmación del banco...
              </div>
            </div>
          )}

          {charge?.status === "CONFIRMED" && (
            <div className="flex flex-col items-center gap-2 py-8 text-center">
              <CheckCircle2 className="size-8 text-emerald-600 dark:text-emerald-400" />
              <p className="text-sm font-medium">Pago confirmado</p>
            </div>
          )}

          {(charge?.status === "EXPIRED" || charge?.status === "ERROR") && (
            <div className="flex flex-col items-center gap-2 py-8 text-center">
              <AlertTriangle className="size-8 text-destructive" />
              <p className="text-sm text-destructive">
                {charge.status === "EXPIRED" ? "El QR expiró antes de confirmarse el pago." : "El banco reportó un error con este cobro."}
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={handleClose}>
            {charge?.status === "CONFIRMED" ? "Cerrar" : "Cancelar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
