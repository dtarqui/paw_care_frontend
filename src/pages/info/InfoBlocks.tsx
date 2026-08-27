import { cn } from "@/lib/utils";
import { ArrowRight, Check, Info, TriangleAlert } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";

/**
 * Piezas de presentación del manual. Cada una hace una sola cosa y no sabe nada
 * del contenido: `InfoPage` las compone. Así agregar una sección al manual es
 * escribir texto, no inventar maquetado nuevo.
 */

export function Section({
  id,
  icon: Icon,
  title,
  intro,
  children,
}: {
  id: string;
  icon: LucideIcon;
  title: string;
  intro?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-6 border-t pt-8 first:border-t-0 first:pt-0">
      <div className="mb-4 flex items-start gap-3">
        <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
          <Icon className="size-5 text-primary" />
        </div>
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
          {intro && <p className="text-muted-foreground">{intro}</p>}
        </div>
      </div>
      <div className="flex min-w-0 flex-col gap-4 sm:pl-12">{children}</div>
    </section>
  );
}

/** Pasos numerados. Para "cómo hago X" — el formato que se lee de un vistazo. */
export function Steps({ items }: { items: { title: string; description?: ReactNode }[] }) {
  return (
    <ol className="flex flex-col gap-3">
      {items.map((step, index) => (
        <li key={step.title} className="flex gap-3">
          <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
            {index + 1}
          </span>
          <div className="flex min-w-0 flex-col gap-0.5">
            <p className="font-medium">{step.title}</p>
            {step.description && <div className="text-sm text-muted-foreground">{step.description}</div>}
          </div>
        </li>
      ))}
    </ol>
  );
}

const CALLOUT_STYLES = {
  info: {
    icon: Info,
    box: "border-sky-300 bg-sky-50 text-sky-900 dark:border-sky-500/30 dark:bg-sky-500/10 dark:text-sky-200",
    iconColor: "text-sky-600 dark:text-sky-400",
  },
  warning: {
    icon: TriangleAlert,
    box: "border-amber-300 bg-amber-50 text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200",
    iconColor: "text-amber-600 dark:text-amber-400",
  },
  tip: {
    icon: Check,
    box: "border-emerald-300 bg-emerald-50 text-emerald-900 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-200",
    iconColor: "text-emerald-600 dark:text-emerald-400",
  },
} as const;

/** Aviso destacado. `warning` para lo que puede sorprender o salir mal. */
export function Callout({
  tone = "info",
  title,
  children,
}: {
  tone?: keyof typeof CALLOUT_STYLES;
  title?: string;
  children: ReactNode;
}) {
  const style = CALLOUT_STYLES[tone];
  const Icon = style.icon;
  return (
    <div className={cn("flex items-start gap-3 rounded-lg border p-3.5 text-sm", style.box)}>
      <Icon className={cn("mt-0.5 size-4 shrink-0", style.iconColor)} />
      <div className="flex min-w-0 flex-col gap-1">
        {title && <p className="font-medium">{title}</p>}
        <div className="[&_strong]:font-semibold">{children}</div>
      </div>
    </div>
  );
}

/**
 * Diagrama de flujo. En escritorio va horizontal con flechas; en móvil se apila
 * y las flechas rotan, para que siga leyéndose como una secuencia.
 */
export function FlowDiagram({ steps }: { steps: { icon: LucideIcon; label: string; caption?: string }[] }) {
  return (
    <div className="flex flex-col items-stretch gap-2 rounded-xl border bg-muted/30 p-4 sm:flex-row sm:items-center">
      {steps.map((step, index) => {
        const Icon = step.icon;
        return (
          <div key={step.label} className="flex flex-1 items-center gap-2 sm:flex-col sm:gap-2">
            <div className="flex flex-1 items-center gap-3 sm:flex-col sm:gap-2 sm:text-center">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border bg-card">
                <Icon className="size-5 text-primary" />
              </div>
              <div className="flex min-w-0 flex-col sm:items-center">
                <span className="text-sm font-medium">{step.label}</span>
                {step.caption && <span className="text-xs text-muted-foreground">{step.caption}</span>}
              </div>
            </div>
            {index < steps.length - 1 && (
              <ArrowRight
                className="size-4 shrink-0 rotate-90 text-muted-foreground/50 sm:rotate-0"
                aria-hidden
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

/**
 * Matriz de qué puede hacer cada rol.
 *
 * En celular no se dibuja como tabla: cuatro columnas en 320px dejan el nombre del
 * módulo en un hilo y los encabezados se pisan entre sí. Ahí va como lista —un
 * módulo por fila con los roles que sí tienen acceso— que es como se lee igual, en
 * voz alta: "Pagos: Administrador y Recepción".
 */
export function RoleMatrix({
  roles,
  rows,
}: {
  roles: string[];
  rows: { area: string; access: boolean[] }[];
}) {
  const { t } = useTranslation();

  return (
    <>
      <ul className="flex flex-col gap-2 sm:hidden">
        {rows.map((row) => {
          const allowed = roles.filter((_, i) => row.access[i]);
          return (
            <li key={row.area} className="rounded-lg border p-3">
              <p className="font-medium">{row.area}</p>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {allowed.length === 0 ? (
                  <span className="text-sm text-muted-foreground">—</span>
                ) : (
                  allowed.map((role) => (
                    <span
                      key={role}
                      className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground"
                    >
                      {role}
                    </span>
                  ))
                )}
              </div>
            </li>
          );
        })}
      </ul>

      <div className="hidden min-w-0 overflow-x-auto rounded-lg border sm:block">
        {/* `table-fixed`: con el ancho automático la tabla reclamaba un mínimo mayor
            que la pantalla y hacía scrollear la página de lado. Fijando el reparto,
            las columnas de rol se quedan angostas —solo llevan un tilde— y el nombre
            del módulo usa el resto. */}
        <table className="w-full table-fixed text-sm">
          <thead>
            <tr className="border-b bg-muted/40">
              <th className="px-3 py-2 text-left font-medium">{t("info.moduleColumn")}</th>
              {roles.map((role) => (
                <th key={role} className="w-28 px-3 py-2 text-center font-medium">
                  {role}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.area} className="border-b last:border-b-0">
                <td className="px-3 py-2">{row.area}</td>
                {row.access.map((has, i) => (
                  <td key={`${row.area}-${i}`} className="px-3 py-2 text-center">
                    {has ? (
                      <>
                        <Check className="mx-auto size-4 text-emerald-600 dark:text-emerald-400" aria-hidden />
                        <span className="sr-only">{t("info.hasAccess")}</span>
                      </>
                    ) : (
                      <>
                        <span aria-hidden className="text-muted-foreground/40">
                          —
                        </span>
                        <span className="sr-only">{t("info.noAccess")}</span>
                      </>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

/** Camino de estados (ej. una cita: Confirmada → Atendida | Cancelada). */
export function StateFlow({
  from,
  to,
}: {
  from: { label: string; description: string };
  to: { label: string; description: string; tone: "good" | "muted" }[];
}) {
  return (
    <div className="flex flex-col items-stretch gap-3 rounded-xl border bg-muted/30 p-4 sm:flex-row sm:items-center">
      <div className="flex flex-1 flex-col gap-0.5 rounded-lg border bg-card p-3">
        <span className="text-sm font-medium">{from.label}</span>
        <span className="text-xs text-muted-foreground">{from.description}</span>
      </div>
      <ArrowRight className="size-4 shrink-0 rotate-90 self-center text-muted-foreground/50 sm:rotate-0" aria-hidden />
      <div className="flex flex-1 flex-col gap-2">
        {to.map((state) => (
          <div
            key={state.label}
            className={cn(
              "flex flex-col gap-0.5 rounded-lg border p-3",
              state.tone === "good"
                ? "border-emerald-300 bg-emerald-50 dark:border-emerald-500/30 dark:bg-emerald-500/10"
                : "bg-card"
            )}
          >
            <span className="text-sm font-medium">{state.label}</span>
            <span className="text-xs text-muted-foreground">{state.description}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Par pregunta/respuesta para las FAQ. */
export function Faq({ items }: { items: { question: string; answer: ReactNode }[] }) {
  return (
    <div className="flex flex-col divide-y rounded-lg border">
      {items.map((item) => (
        <details key={item.question} className="group px-4 py-3">
          <summary className="cursor-pointer list-none font-medium marker:content-none [&::-webkit-details-marker]:hidden">
            <span className="flex items-center justify-between gap-3">
              {item.question}
              <ArrowRight className="size-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-90" />
            </span>
          </summary>
          <div className="pt-2 text-sm text-muted-foreground">{item.answer}</div>
        </details>
      ))}
    </div>
  );
}

/**
 * Énfasis dentro del texto del manual. El contenido vive en los archivos de
 * traducción, así que no puede traer JSX: marca lo importante con `**negrita**` y
 * los matices con `*cursiva*`, y esto lo convierte en `<strong>` / `<em>`.
 */
export function RichText({ children }: { children: string }) {
  const parts = children.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g).filter(Boolean);
  return (
    <>
      {parts.map((part, index) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return <strong key={index}>{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith("*") && part.endsWith("*")) {
          return <em key={index}>{part.slice(1, -1)}</em>;
        }
        return <span key={index}>{part}</span>;
      })}
    </>
  );
}
