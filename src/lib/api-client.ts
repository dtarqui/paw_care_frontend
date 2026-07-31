const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000";
const TOKEN_STORAGE_KEY = "pawcare.token";

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
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
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const response = await fetch(`${API_URL}${path}`, { ...options, headers });

  if (response.status === 401) {
    tokenStorage.clear();
    window.location.href = "/login";
    throw new ApiError("Sesión expirada", 401);
  }

  const body = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new ApiError(body.error ?? "Error inesperado del servidor", response.status);
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

    const response = await fetch(`${API_URL}${path}`, { method: "POST", headers, body: formData });
    if (response.status === 401) {
      tokenStorage.clear();
      window.location.href = "/login";
      throw new ApiError("Sesión expirada", 401);
    }
    const body = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new ApiError(body.error ?? "Error inesperado del servidor", response.status);
    }
    return body as T;
  },

  /** Descarga un archivo (Excel/PDF) que el backend genera al vuelo, adjuntando el
   * token — un <a href> normal no puede mandar el header Authorization. */
  async download(path: string, filenameFallback: string): Promise<void> {
    const token = tokenStorage.get();
    const headers = new Headers();
    if (token) headers.set("Authorization", `Bearer ${token}`);

    const response = await fetch(`${API_URL}${path}`, { headers });
    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      throw new ApiError(body.error ?? "No se pudo descargar el archivo", response.status);
    }

    const blob = await response.blob();
    const disposicion = response.headers.get("Content-Disposition");
    const nombre = disposicion?.match(/filename="(.+)"/)?.[1] ?? filenameFallback;

    const url = URL.createObjectURL(blob);
    const enlace = document.createElement("a");
    enlace.href = url;
    enlace.download = nombre;
    document.body.appendChild(enlace);
    enlace.click();
    enlace.remove();
    URL.revokeObjectURL(url);
  },
};
