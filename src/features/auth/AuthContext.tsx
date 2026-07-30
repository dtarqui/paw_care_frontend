import { tokenStorage } from "@/lib/api-client";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { authApi } from "./api";
import type { UsuarioSesion } from "./types";

const USER_STORAGE_KEY = "pawcare.usuario";

interface AuthContextValue {
  usuario: UsuarioSesion | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function readStoredUser(): UsuarioSesion | null {
  const raw = localStorage.getItem(USER_STORAGE_KEY);
  return raw ? (JSON.parse(raw) as UsuarioSesion) : null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<UsuarioSesion | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = tokenStorage.get();
    if (token) setUsuario(readStoredUser());
    setIsLoading(false);
  }, []);

  async function login(username: string, password: string) {
    const { token, usuario: usuarioLogueado } = await authApi.login(username, password);
    tokenStorage.set(token);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(usuarioLogueado));
    setUsuario(usuarioLogueado);
  }

  function logout() {
    tokenStorage.clear();
    localStorage.removeItem(USER_STORAGE_KEY);
    setUsuario(null);
  }

  return (
    <AuthContext.Provider value={{ usuario, isAuthenticated: !!usuario, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  return ctx;
}
