import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { searchApi } from "./api";

/** Mismo umbral que aplica el backend: por debajo no se consulta. */
export const MIN_SEARCH_LENGTH = 2;
const DEBOUNCE_MS = 250;

/** Retrasa el valor para no disparar una request por tecla. */
function useDebounced<T>(value: T, delay = DEBOUNCE_MS): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

export function useSearch(term: string) {
  const debouncedTerm = useDebounced(term.trim());
  const enabled = debouncedTerm.length >= MIN_SEARCH_LENGTH;

  const query = useQuery({
    queryKey: ["search", debouncedTerm],
    queryFn: async () => (await searchApi.search(debouncedTerm)).results,
    enabled,
    staleTime: 30_000,
  });

  return {
    results: enabled ? (query.data ?? []) : [],
    isLoading: enabled && query.isFetching,
    isEnabled: enabled,
    /** true mientras el usuario sigue tipeando y todavía no se consultó ese término. */
    isTyping: term.trim() !== debouncedTerm,
  };
}
