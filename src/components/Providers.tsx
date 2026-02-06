"use client";

import { MiniKit } from "@worldcoin/minikit-js";
import { CartProvider } from "@/store/cart";
import { AuthProvider } from "@/components/AuthContext";
import { useEffect, type ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  useEffect(() => {
    MiniKit.install(process.env.NEXT_PUBLIC_APP_ID);
  }, []);

  return (
    <AuthProvider>
      <CartProvider>{children}</CartProvider>
    </AuthProvider>
  );
}
