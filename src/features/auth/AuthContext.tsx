import { tokenStorage } from "@/lib/api-client";
import { queryClient } from "@/lib/query-client";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { authApi } from "./api";
import type { SessionUser } from "./types";

const USER_STORAGE_KEY = "pawcare.user";

interface AuthContextValue {
  user: SessionUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function readStoredUser(): SessionUser | null {
  const raw = localStorage.getItem(USER_STORAGE_KEY);
  return raw ? (JSON.parse(raw) as SessionUser) : null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = tokenStorage.get();
    if (token) setUser(readStoredUser());
    setIsLoading(false);
  }, []);

  async function login(username: string, password: string) {
    const { token, user: loggedUser } = await authApi.login(username, password);
    // La caché de TanStack vive en memoria y no se entera de que cambió la persona:
    // sin este borrado, quien entra después hereda lo que quedó cargado de la sesión
    // anterior. En el mostrador eso es real —una recepcionista cierra sesión, entra
    // un veterinario en la misma pestaña— y le mostraba el listado de cuentas del
    // administrador, con CI y roles, sin que el backend enviara nada.
    queryClient.clear();
    tokenStorage.set(token);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(loggedUser));
    setUser(loggedUser);
  }

  function logout() {
    tokenStorage.clear();
    localStorage.removeItem(USER_STORAGE_KEY);
    // Se limpia también al salir, no solo al entrar: entre una cosa y la otra la
    // pantalla de login queda abierta con los datos de la sesión anterior todavía en
    // memoria, al alcance del botón "atrás" del navegador.
    queryClient.clear();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  return ctx;
}
