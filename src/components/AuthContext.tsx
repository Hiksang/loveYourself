"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

type AuthState = {
  isLoggedIn: boolean;
  isVerified: boolean;
  walletAddress: string | null;
};

type AuthContextType = AuthState & {
  login: (address: string) => void;
  verify: () => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<AuthState>({
    isLoggedIn: false,
    isVerified: false,
    walletAddress: null,
  });

  const login = useCallback((address: string) => {
    setAuth((prev) => ({ ...prev, isLoggedIn: true, walletAddress: address }));
  }, []);

  const verify = useCallback(() => {
    setAuth((prev) => ({ ...prev, isVerified: true }));
  }, []);

  const logout = useCallback(() => {
    setAuth({ isLoggedIn: false, isVerified: false, walletAddress: null });
  }, []);

  return (
    <AuthContext.Provider value={{ ...auth, login, verify, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
