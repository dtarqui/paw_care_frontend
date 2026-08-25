import { tokenStorage } from "@/lib/api-client";
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
    tokenStorage.set(token);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(loggedUser));
    setUser(loggedUser);
  }

  function logout() {
    tokenStorage.clear();
    localStorage.removeItem(USER_STORAGE_KEY);
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
