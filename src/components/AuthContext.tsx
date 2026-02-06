"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import { useSearchParams } from "next/navigation";

type AuthState = {
  isLoggedIn: boolean;
  isVerified: boolean;
  walletAddress: string | null;
  nullifierHash: string | null;
  isReady: boolean;
};

type AuthContextType = AuthState & {
  login: (address: string, nullifierHash?: string) => void;
  verify: () => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<AuthState>({
    isLoggedIn: false,
    isVerified: false,
    walletAddress: null,
    nullifierHash: null,
    isReady: false,
  });

  const searchParams = useSearchParams();

  // Dev mode: ?dev=true auto-authenticates for testing
  useEffect(() => {
    if (searchParams.get("dev") === "true") {
      setAuth({
        isLoggedIn: true,
        isVerified: true,
        walletAddress: "0xDev000000000000000000000000000000000000",
        nullifierHash: "0xDev_nullifier_hash_for_testing",
        isReady: true,
      });
    } else {
      setAuth((prev) => ({ ...prev, isReady: true }));
    }
  }, [searchParams]);

  const login = useCallback((address: string, nullifierHash?: string) => {
    setAuth((prev) => ({ ...prev, isLoggedIn: true, walletAddress: address, nullifierHash: nullifierHash || null }));
  }, []);

  const verify = useCallback(() => {
    setAuth((prev) => ({ ...prev, isVerified: true }));
  }, []);

  const logout = useCallback(() => {
    setAuth({ isLoggedIn: false, isVerified: false, walletAddress: null, nullifierHash: null, isReady: true });
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
