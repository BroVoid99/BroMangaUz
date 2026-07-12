"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export interface BroUser {
  name: string;
  email: string;
}

interface AuthContextValue {
  user: BroUser | null;
  login: (name: string, email: string) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);
const KEY = "bromanga:user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<BroUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(KEY);
      if (raw) setUser(JSON.parse(raw));
    } catch {
      // e'tiborsiz qoldiramiz
    }
    setLoading(false);
  }, []);

  function login(name: string, email: string) {
    const u = { name, email };
    setUser(u);
    window.localStorage.setItem(KEY, JSON.stringify(u));
  }

  function logout() {
    setUser(null);
    window.localStorage.removeItem(KEY);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
