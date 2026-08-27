import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { MIN_SEARCH_LENGTH, useSearch } from "@/features/search/useSearch";
import type { SearchResult } from "@/features/search/types";
import { cn } from "@/lib/utils";
import { Loader2, PawPrint, Search, User } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

/**
 * Cómo se presenta cada tipo de resultado. El diálogo no conoce mascotas ni
 * propietarios: lee este registro. Cuando el backend sume un proveedor nuevo
 * (medicamentos, citas…), acá va una entrada más y nada más cambia.
 */
const RESULT_ICONS: Record<string, LucideIcon> = {
  pet: PawPrint,
  owner: User,
};

function iconOf(type: string) {
  return RESULT_ICONS[type] ?? Search;
}

/** Agrupa preservando el orden en que el backend devolvió los resultados. */
function groupByType(results: SearchResult[]) {
  const groups: { type: string; items: SearchResult[] }[] = [];
  for (const result of results) {
    const existing = groups.find((g) => g.type === result.type);
    if (existing) existing.items.push(result);
    else groups.push({ type: result.type, items: [result] });
  }
  return groups;
}

/**
 * Búsqueda global (Ctrl/Cmd + K).
 *
 * Cada pantalla busca dentro de su propio dominio; esto resuelve el caso de
 * "¿quién es Rocky?" sin saber de antemano dónde mirar. Está montada en el shell,
 * así que existe en toda la app autenticada.
 */
export function GlobalSearch({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const { t } = useTranslation();
  const [term, setTerm] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const navigate = useNavigate();
  const listRef = useRef<HTMLDivElement>(null);

  const { results, isLoading, isEnabled, isTyping } = useSearch(term);
  const groups = groupByType(results);

  // Al cerrarse se limpia: la próxima apertura arranca en blanco, que es lo que
  // se espera de un buscador de salto rápido.
  useEffect(() => {
    if (!open) {
      setTerm("");
      setActiveIndex(0);
    }
  }, [open]);

  useEffect(() => setActiveIndex(0), [results.length]);

  function goTo(result: SearchResult) {
    onOpenChange(false);
    navigate(result.route);
  }

  function handleKeyDown(event: React.KeyboardEvent) {
    if (results.length === 0) return;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((i) => (i + 1) % results.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((i) => (i - 1 + results.length) % results.length);
    } else if (event.key === "Enter") {
      event.preventDefault();
      goTo(results[activeIndex]);
    }
  }

  // Índice plano sobre los grupos, para que las flechas recorran todo de corrido.
  let flatIndex = -1;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="top-[15%] max-w-lg translate-y-0 gap-0 overflow-hidden p-0" showCloseButton={false}>
        <DialogTitle className="sr-only">{t("search.title")}</DialogTitle>

        <div className="flex items-center gap-2 border-b px-3">
          <Search className="size-4 shrink-0 text-muted-foreground" />
          <Input
            autoFocus
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t("search.placeholder")}
            className="h-12 border-0 px-0 shadow-none focus-visible:ring-0"
            aria-label={t("search.ariaLabel")}
          />
          {(isLoading || isTyping) && <Loader2 className="size-4 shrink-0 animate-spin text-muted-foreground" />}
        </div>

        <div ref={listRef} className="max-h-80 overflow-y-auto p-2">
          {!isEnabled && (
            <p className="px-2 py-6 text-center text-sm text-muted-foreground">
              {t("search.hint", { min: MIN_SEARCH_LENGTH })}
            </p>
          )}

          {isEnabled && !isLoading && !isTyping && results.length === 0 && (
            <p className="px-2 py-6 text-center text-sm text-muted-foreground">
              {t("search.noResults", { term: term.trim() })}
            </p>
          )}

          {groups.map((group) => (
            <div key={group.type} className="mb-1 last:mb-0">
              <p className="px-2 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/60">
                {t(`search.kinds.${group.type}`, { defaultValue: t("search.kinds.other") })}
              </p>
              {group.items.map((result) => {
                flatIndex += 1;
                const index = flatIndex;
                const Icon = iconOf(result.type);
                return (
                  <button
                    key={`${result.type}-${result.id}`}
                    type="button"
                    onClick={() => goTo(result)}
                    onMouseEnter={() => setActiveIndex(index)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-md px-2 py-2 text-left transition-colors",
                      index === activeIndex ? "bg-accent text-accent-foreground" : "hover:bg-accent/50"
                    )}
                  >
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted">
                      <Icon className="size-4 text-muted-foreground" />
                    </div>
                    <div className="flex min-w-0 flex-col">
                      <span className="truncate text-sm font-medium">{result.title}</span>
                      {result.subtitle && (
                        <span className="truncate text-xs text-muted-foreground">{result.subtitle}</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3 border-t px-3 py-2 text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1">
            <kbd className="rounded border bg-muted px-1 py-0.5 font-sans">↑</kbd>
            <kbd className="rounded border bg-muted px-1 py-0.5 font-sans">↓</kbd>
            {t("search.navigate")}
          </span>
          <span className="flex items-center gap-1">
            <kbd className="rounded border bg-muted px-1 py-0.5 font-sans">Enter</kbd>
            {t("search.open")}
          </span>
          <span className="flex items-center gap-1">
            <kbd className="rounded border bg-muted px-1 py-0.5 font-sans">Esc</kbd>
            {t("search.close")}
          </span>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/** Registra el atajo Ctrl/Cmd + K y expone el estado de apertura. */
export function useGlobalSearchShortcut() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen((v) => !v);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return { open, setOpen };
}
