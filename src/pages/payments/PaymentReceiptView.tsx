import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { paymentsApi } from "@/features/payments/api";
import type { PaymentReceipt } from "@/features/payments/types";
import { useFormatters } from "@/lib/useFormatters";
import { whatsappLink } from "@/lib/whatsapp";
import { Download, Loader2, MessageCircle } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

/** El tilde se dibuja solo; el círculo lo empuja desde atrás con un halo que se
 * expande y se apaga. Las clases viven en `index.css`, junto a los keyframes. */
function SuccessMark() {
  return (
    <div className="relative flex size-16 items-center justify-center">
      <span
        aria-hidden
        className="receipt-halo absolute inset-0 rounded-full bg-emerald-500/25"
      />
      <span className="receipt-badge relative flex size-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-500/15">
        <svg viewBox="0 0 24 24" className="size-8" fill="none" aria-hidden>
          <path
            d="M5 12.5 10 17.5 19 7.5"
            className="receipt-check stroke-emerald-600 dark:stroke-emerald-400"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </div>
  );
}

function DetailRow({ label, value, step }: { label: string; value: string; step: number }) {
  return (
    <div className={`receipt-rise-${step} flex items-baseline justify-between gap-4 py-1.5`}>
      <dt className="shrink-0 text-sm text-muted-foreground">{label}</dt>
      <dd className="min-w-0 text-right text-sm font-medium">{value}</dd>
    </div>
  );
}

/**
 * La cara de confirmación del cobro: el comprobante ya emitido.
 *
 * Reemplaza al toast que había antes. Un aviso que se desvanece no sirve para el
 * momento en que cambia plata de manos — acá queda el número de comprobante a la
 * vista, que es el dato que se cita cuando alguien reclama "no me cobraron eso", y
 * las dos formas de entregárselo al cliente: el PDF y WhatsApp.
 */
export function PaymentReceiptView({ receipt, onClose }: { receipt: PaymentReceipt; onClose: () => void }) {
  const { t } = useTranslation();
  const { formatDateTime } = useFormatters();
  const [downloading, setDownloading] = useState(false);

  async function download() {
    setDownloading(true);
    try {
      await paymentsApi.downloadReceipt(receipt);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("payments.receipt.downloadError"));
    } finally {
      setDownloading(false);
    }
  }

  const message = t("payments.receipt.whatsappMessage", {
    owner: receipt.owner.firstName,
    pet: receipt.pet.name,
    amount: receipt.amount.toFixed(2),
    service: t(`enums.serviceType.${receipt.visit.serviceType}`, { defaultValue: receipt.visit.serviceType }),
    number: receipt.receiptNumber,
  });

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col items-center gap-3 pt-2 text-center">
        <SuccessMark />
        <div className="receipt-rise-0 flex flex-col gap-1">
          <p className="text-sm text-muted-foreground">{t("payments.receipt.title")}</p>
          <p className="text-3xl font-semibold tabular-nums">Bs. {receipt.amount.toFixed(2)}</p>
        </div>
        <p className="receipt-rise-1 font-mono text-xs text-muted-foreground">{receipt.receiptNumber}</p>
      </div>

      <dl className="receipt-rise-2 divide-y rounded-lg border px-3 py-1">
        <DetailRow
          label={t("common.owner")}
          value={`${receipt.owner.firstName} ${receipt.owner.paternalLastName}`}
          step={2}
        />
        <DetailRow
          label={t("payments.receipt.concept")}
          value={`${t(`enums.serviceType.${receipt.visit.serviceType}`, {
            defaultValue: receipt.visit.serviceType,
          })} — ${receipt.pet.name}`}
          step={3}
        />
        <DetailRow label={t("payments.method")} value={t(`enums.status.${receipt.method}`)} step={4} />
        <DetailRow label={t("common.date")} value={formatDateTime(receipt.date)} step={5} />
      </dl>

      {/* Las dos formas de entregarle el comprobante al cliente van juntas y a igual
          peso; "Cerrar" queda debajo porque es lo último que se hace, no lo primero.
          En una fila de tres no entraban: el diálogo mide 384px y el texto se cortaba. */}
      <DialogFooter className="receipt-rise-6 flex-col gap-2 sm:flex-col">
        <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2">
          {/* Sin teléfono no hay a quién escribirle: el botón no se muestra en vez de
              ofrecer algo que va a fallar. */}
          {receipt.owner.phone && (
            <Button asChild type="button" variant="outline">
              <a href={whatsappLink(receipt.owner.phone, message)} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="size-4" />
                {t("payments.receipt.sendWhatsapp")}
              </a>
            </Button>
          )}
          <Button
            type="button"
            onClick={download}
            disabled={downloading}
            className={receipt.owner.phone ? undefined : "sm:col-span-2"}
          >
            {downloading ? <Loader2 className="size-4 animate-spin" /> : <Download className="size-4" />}
            {t("payments.receipt.download")}
          </Button>
        </div>
        <Button type="button" variant="ghost" className="w-full" onClick={onClose}>
          {t("common.close")}
        </Button>
      </DialogFooter>
    </div>
  );
}
