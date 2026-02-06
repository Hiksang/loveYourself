"use client";

import { MiniKit } from "@worldcoin/minikit-js";
import { CartProvider } from "@/store/cart";
import { AuthProvider } from "@/components/AuthContext";
import { Suspense, useEffect, type ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  useEffect(() => {
    MiniKit.install(process.env.NEXT_PUBLIC_APP_ID);
  }, []);

  return (
    <Suspense>
      <AuthProvider>
        <CartProvider>{children}</CartProvider>
      </AuthProvider>
    </Suspense>
  );
}
