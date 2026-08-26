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

interface QrChargeDialogProps {
  pendingPayment: PendingPayment | null;
  onClose: () => void;
}

/** Muestra el QR generado por el banco y hace polling (cada 3s, ver useCobroQr) hasta
 * que se confirme, expire o falle — no hay websockets en el proyecto, así que no hay
 * forma de que el banco "avise" al frontend salvo preguntando periódicamente. */
export function QrChargeDialog({ pendingPayment, onClose }: QrChargeDialogProps) {
  const queryClient = useQueryClient();
  const generateQrChargeMutation = useGenerateQrCharge();
  const [chargeId, setChargeId] = useState<number | null>(null);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const { data: charge } = useQrCharge(chargeId);

  useEffect(() => {
    if (!pendingPayment) {
      setChargeId(null);
      setGenerationError(null);
      return;
    }
    setGenerationError(null);
    generateQrChargeMutation.mutate(pendingPayment.visitId, {
      onSuccess: (data) => setChargeId(data.charge.id),
      onError: (err) => setGenerationError(err instanceof Error ? err.message : "No se pudo generar el cobro QR"),
    });
    // Solo debe re-disparar cuando cambia la atención seleccionada, no en cada render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingPayment?.visitId]);

  useEffect(() => {
    if (charge?.status === "CONFIRMED") {
      queryClient.invalidateQueries({ queryKey: ["pagos", "pendientes"] });
      queryClient.invalidateQueries({ queryKey: ["pagos", "historial"] });
    }
  }, [charge?.status, queryClient]);

  if (!pendingPayment) return null;

  function handleClose() {
    setChargeId(null);
    setGenerationError(null);
    onClose();
  }

  return (
    <Dialog open={!!pendingPayment} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cobrar con QR</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="rounded-md border bg-muted/40 p-3 text-sm">
            <p className="font-medium">{pendingPayment.pet.name}</p>
            <p className="text-muted-foreground">
              {pendingPayment.owner.firstName} {pendingPayment.owner.paternalLastName} — Bs. {pendingPayment.amount.toFixed(2)}
            </p>
          </div>

          {generateQrChargeMutation.isPending && (
            <div className="flex flex-col items-center gap-2 py-8 text-center text-muted-foreground">
              <Loader2 className="size-6 animate-spin" />
              <p>Generando QR con el banco...</p>
            </div>
          )}

          {generationError && (
            <div className="flex flex-col items-center gap-2 py-8 text-center">
              <AlertTriangle className="size-8 text-destructive" />
              <p className="text-sm text-destructive">{generationError}</p>
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
