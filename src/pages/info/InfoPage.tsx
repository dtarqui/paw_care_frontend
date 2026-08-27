import { Card, CardContent } from "@/components/ui/card";
import {
  CalendarDays,
  FileBarChart,
  HelpCircle,
  LogIn,
  MessageCircle,
  Package,
  PawPrint,
  Settings,
  ShieldPlus,
  Stethoscope,
  User,
  UserCog,
  Users,
  Wallet,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Callout, Faq, FlowDiagram, RichText, RoleMatrix, Section, StateFlow, Steps } from "./InfoBlocks";

/**
 * Manual de uso, no documentación técnica: la audiencia es quien atiende en el
 * mostrador, no quien mantiene el código.
 *
 * Todo el texto vive en `info.*` de los archivos de traducción; acá quedan solo el
 * orden de las secciones, sus íconos y qué bloques usa cada una. Agregar una sección
 * es sumarla a `SECTIONS` y escribir su contenido en `es.json` y `en.json`.
 */
const SECTIONS: { id: string; icon: LucideIcon }[] = [
  { id: "gettingStarted", icon: LogIn },
  { id: "roles", icon: Users },
  { id: "dayToDay", icon: CalendarDays },
  { id: "clients", icon: PawPrint },
  { id: "schedule", icon: CalendarDays },
  { id: "care", icon: Stethoscope },
  { id: "preventive", icon: ShieldPlus },
  { id: "payments", icon: Wallet },
  { id: "reminders", icon: MessageCircle },
  { id: "inventory", icon: Package },
  { id: "reports", icon: FileBarChart },
  { id: "staff", icon: UserCog },
  { id: "account", icon: Settings },
  { id: "faq", icon: HelpCircle },
];

/**
 * Quién puede entrar a qué. Vive acá y no en los archivos de traducción por dos
 * razones: son permisos del sistema (espejo de `dashboard.service.ts`), no prosa; y
 * porque al pasar por i18next los booleanos volvían como texto, con lo cual `"false"`
 * resultaba verdadero y la matriz afirmaba que todos los roles pueden todo.
 *
 * El orden de `access` sigue al de `ROLE_COLUMNS`.
 */
const ROLE_COLUMNS = ["ADMIN", "VET", "RECEPTIONIST"] as const;

const ROLE_MATRIX: { area: string; access: boolean[] }[] = [
  { area: "owners", access: [true, false, true] },
  { area: "pets", access: [true, true, true] },
  { area: "appointments", access: [true, true, true] },
  { area: "workingHours", access: [true, true, false] },
  { area: "medicalCare", access: [true, true, false] },
  { area: "preventiveCare", access: [true, true, false] },
  { area: "reminders", access: [true, false, true] },
  { area: "payments", access: [true, false, true] },
  { area: "inventory", access: [true, false, false] },
  { area: "reports", access: [true, false, false] },
  { area: "staff", access: [true, false, false] },
];

/** Los íconos del recorrido Cliente → Mascota → Cita → Atención → Cobro. */
const FLOW_ICONS: LucideIcon[] = [User, PawPrint, CalendarDays, Stethoscope, Wallet];

interface TextItem {
  title: string;
  description: string;
}

/** De `lg` para arriba el índice es una columna fija siempre visible; por debajo es
 * un desplegable que arranca cerrado — si no, sus 14 entradas ocupan la primera
 * pantalla entera del celular antes de que se lea una sola línea del manual. */
function useTocOpenByDefault() {
  const [open, setOpen] = useState(() =>
    typeof window === "undefined" ? true : window.matchMedia("(min-width: 1024px)").matches
  );

  useEffect(() => {
    const query = window.matchMedia("(min-width: 1024px)");
    const sync = (e: MediaQueryList | MediaQueryListEvent) => setOpen(e.matches);
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  return [open, setOpen] as const;
}

export function InfoPage() {
  const { t } = useTranslation();
  const [tocOpen, setTocOpen] = useTocOpenByDefault();

  /** Listas del manual (pasos, tarjetas, preguntas). Devuelve [] si una sección no
   * define ese bloque, así cada `<Section>` renderiza solo lo que tiene. */
  function list<T>(key: string): T[] {
    const value = t(key, { returnObjects: true, defaultValue: [] });
    return Array.isArray(value) ? (value as T[]) : [];
  }

  function callouts(sectionId: string) {
    return list<{ tone: "info" | "warning" | "tip"; title: string; body: string }>(
      `info.sections.${sectionId}.callouts`
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{t("info.title")}</h1>
        <p className="text-muted-foreground">{t("info.subtitle")}</p>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        {/* Índice: fijo al costado en pantallas grandes, plegado arriba en el resto */}
        <nav className="lg:sticky lg:top-6 lg:w-56 lg:shrink-0" aria-label={t("info.tocLabel")}>
          <details className="rounded-lg border" open={tocOpen} onToggle={(e) => setTocOpen(e.currentTarget.open)}>
            <summary className="cursor-pointer px-3 py-2 text-sm font-medium lg:hidden">
              {t("info.tocSummary")}
            </summary>
            <ol className="flex flex-col p-2 lg:p-2">
              {SECTIONS.map((section, index) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    className="flex items-baseline gap-2 rounded-md px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                  >
                    <span className="w-4 shrink-0 text-right text-xs tabular-nums opacity-60">{index + 1}</span>
                    {t(`info.sections.${section.id}.title`)}
                  </a>
                </li>
              ))}
            </ol>
          </details>
        </nav>

        <Card className="min-w-0 flex-1">
          <CardContent className="flex flex-col gap-8 py-6">
            {SECTIONS.map(({ id, icon }) => {
              const steps = list<TextItem>(`info.sections.${id}.steps`);
              const cards = list<TextItem>(`info.sections.${id}.cards`);
              const notes = list<string>(`info.sections.${id}.notes`);
              const faqs = list<{ question: string; answer: string }>(`info.sections.${id}.faq`);
              const intro = t(`info.sections.${id}.intro`, { defaultValue: "" });

              return (
                <Section
                  key={id}
                  id={id}
                  icon={icon}
                  title={t(`info.sections.${id}.title`)}
                  intro={intro || undefined}
                >
                  {steps.length > 0 && <Steps items={steps} />}

                  {id === "roles" && (
                    <RoleMatrix
                      roles={ROLE_COLUMNS.map((role) => t(`enums.role.${role}`))}
                      rows={ROLE_MATRIX.map((row) => ({
                        ...row,
                        area: t(`info.sections.roles.areas.${row.area}`),
                      }))}
                    />
                  )}

                  {id === "dayToDay" && (
                    <FlowDiagram
                      steps={list<{ label: string; caption: string }>("info.sections.dayToDay.flow").map(
                        (step, index) => ({ ...step, icon: FLOW_ICONS[index] ?? PawPrint })
                      )}
                    />
                  )}

                  {id === "schedule" && (
                    <StateFlow
                      from={t("info.sections.schedule.states.from", { returnObjects: true }) as {
                        label: string;
                        description: string;
                      }}
                      to={
                        t("info.sections.schedule.states.to", { returnObjects: true }) as {
                          label: string;
                          description: string;
                          tone: "good" | "muted";
                        }[]
                      }
                    />
                  )}

                  {cards.length > 0 && (
                    <div className={cards.length === 3 ? "grid gap-3 sm:grid-cols-3" : "grid gap-3 sm:grid-cols-2"}>
                      {cards.map((card) => (
                        <div key={card.title} className="rounded-lg border p-3.5">
                          <p className="mb-1 font-medium">{card.title}</p>
                          <p className="text-sm text-muted-foreground">
                            <RichText>{card.description}</RichText>
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {callouts(id).map((callout) => (
                    <Callout key={callout.title} tone={callout.tone} title={callout.title}>
                      <RichText>{callout.body}</RichText>
                    </Callout>
                  ))}

                  {notes.map((note) => (
                    <p key={note} className="text-sm text-muted-foreground">
                      <RichText>{note}</RichText>
                    </p>
                  ))}

                  {faqs.length > 0 && <Faq items={faqs} />}
                </Section>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
