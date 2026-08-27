import i18n, { t } from "i18next";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000";
const TOKEN_STORAGE_KEY = "pawcare.token";

export class ApiError extends Error {
  status: number;
  /** Identificador estable del error del backend (`PetNotFoundError`, `Forbidden`…).
   * Se guarda por si un caller quiere distinguir un caso puntual; el `message` ya
   * viene traducido al idioma actual. */
  code?: string;

  constructor(message: string, status: number, code?: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}

/**
 * El backend manda `error` en español y `code` con el nombre estable del error.
 * Si hay traducción para ese código, gana; si no, se muestra el mensaje del
 * servidor. Así un error nuevo se ve en español en vez de mostrar una clave cruda.
 */
function messageFor(body: { error?: string; code?: string }): string {
  const fallback = body.error ?? t("common.genericError");
  return body.code ? t(`errors.codes.${body.code}`, { defaultValue: fallback }) : fallback;
}

export const tokenStorage = {
  get: () => localStorage.getItem(TOKEN_STORAGE_KEY),
  set: (token: string) => localStorage.setItem(TOKEN_STORAGE_KEY, token),
  clear: () => localStorage.removeItem(TOKEN_STORAGE_KEY),
};

/**
 * Cliente HTTP único de la app: agrega la URL base, adjunta el token (si existe)
 * y normaliza los errores del backend en un solo tipo (ApiError). Toda llamada
 * a la API pasa por acá — así ningún feature tiene que repetir esta lógica.
 */
async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = tokenStorage.get();
  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");
  headers.set("Accept-Language", i18n.resolvedLanguage ?? i18n.language ?? "es");
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const response = await fetch(`${API_URL}${path}`, { ...options, headers });

  // Un 401 solo significa "sesión expirada" cuando la request llevaba un token que el
  // backend rechazó — si no había token (ej. el propio POST /api/auth/login con
  // credenciales incorrectas), es un error de negocio normal y debe dejarse fluir
  // hacia abajo para que el caller lo muestre inline, sin recargar la página.
  if (response.status === 401 && token) {
    tokenStorage.clear();
    window.location.href = "/login";
    throw new ApiError(t("errors.codes.SessionExpired"), 401, "SessionExpired");
  }

  const body = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new ApiError(messageFor(body), response.status, body.code);
  }

  return body as T;
}

export const apiClient = {
  get: <T>(path: string) => request<T>(path, { method: "GET" }),
  post: <T>(path: string, data?: unknown) =>
    request<T>(path, { method: "POST", body: data ? JSON.stringify(data) : undefined }),
  patch: <T>(path: string, data?: unknown) =>
    request<T>(path, { method: "PATCH", body: data ? JSON.stringify(data) : undefined }),
  put: <T>(path: string, data?: unknown) =>
    request<T>(path, { method: "PUT", body: data ? JSON.stringify(data) : undefined }),
  delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),

  /** POST con multipart/form-data (subida de archivos) — sin fijar Content-Type,
   * el navegador arma el boundary correcto solo cuando el body es un FormData real. */
  async postForm<T>(path: string, formData: FormData): Promise<T> {
    const token = tokenStorage.get();
    const headers = new Headers();
    if (token) headers.set("Authorization", `Bearer ${token}`);

    headers.set("Accept-Language", i18n.resolvedLanguage ?? i18n.language ?? "es");

    const response = await fetch(`${API_URL}${path}`, { method: "POST", headers, body: formData });
    if (response.status === 401) {
      tokenStorage.clear();
      window.location.href = "/login";
      throw new ApiError(t("errors.codes.SessionExpired"), 401, "SessionExpired");
    }
    const body = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new ApiError(messageFor(body), response.status, body.code);
    }
    return body as T;
  },

  /** Descarga un archivo (Excel/PDF) que el backend genera al vuelo, adjuntando el
   * token — un <a href> normal no puede mandar el header Authorization. */
  async download(path: string, filenameFallback: string): Promise<void> {
    const token = tokenStorage.get();
    const headers = new Headers();
    if (token) headers.set("Authorization", `Bearer ${token}`);

    headers.set("Accept-Language", i18n.resolvedLanguage ?? i18n.language ?? "es");

    const response = await fetch(`${API_URL}${path}`, { headers });
    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      throw new ApiError(body.error ?? t("errors.downloadFailed"), response.status);
    }

    const blob = await response.blob();
    const disposition = response.headers.get("Content-Disposition");
    const filename = disposition?.match(/filename="(.+)"/)?.[1] ?? filenameFallback;

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  },
};
