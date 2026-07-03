import React, { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import api from "../lib/api";

interface User {
  id: string;
  name: string;
  email: string;
  role: "STUDENT" | "ADMIN";
  points?: number;
  streak?: number;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  registerAdmin: (name: string, email: string, password: string, adminCode: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem("dfq_token"));
  const [loading, setLoading] = useState(true);

  // Load user on mount if token exists
  useEffect(() => {
    if (token) {
      api.get("/auth/me")
        .then((res) => setUser(res.data.user))
        .catch(() => {
          localStorage.removeItem("dfq_token");
          localStorage.removeItem("dfq_user");
          setToken(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = useCallback(async (email: string, password: string) => {
    const res = await api.post("/auth/login", { email, password });
    const { token: t, user: u } = res.data;
    localStorage.setItem("dfq_token", t);
    localStorage.setItem("dfq_user", JSON.stringify(u));
    setToken(t);
    setUser(u);
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    const res = await api.post("/auth/register", { name, email, password });
    const { token: t, user: u } = res.data;
    localStorage.setItem("dfq_token", t);
    localStorage.setItem("dfq_user", JSON.stringify(u));
    setToken(t);
    setUser(u);
  }, []);

  const registerAdmin = useCallback(async (name: string, email: string, password: string, adminCode: string) => {
    const res = await api.post("/auth/register/admin", { name, email, password, adminCode });
    const { token: t, user: u } = res.data;
    localStorage.setItem("dfq_token", t);
    localStorage.setItem("dfq_user", JSON.stringify(u));
    setToken(t);
    setUser(u);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("dfq_token");
    localStorage.removeItem("dfq_user");
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, registerAdmin, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
