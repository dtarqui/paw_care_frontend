import { apiClient } from "@/lib/api-client";
import type { ImportResult } from "./types";

export const importsApi = {
  clients: (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return apiClient.postForm<ImportResult>("/api/imports/clients", formData);
  },
};
