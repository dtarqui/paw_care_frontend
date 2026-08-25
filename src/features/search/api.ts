import { apiClient } from "@/lib/api-client";
import type { SearchResult } from "./types";

export const searchApi = {
  search: (term: string) =>
    apiClient.get<{ results: SearchResult[] }>(`/api/search?q=${encodeURIComponent(term)}`),
};
