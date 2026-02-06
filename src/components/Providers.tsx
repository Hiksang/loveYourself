"use client";

import { MiniKit } from "@worldcoin/minikit-js";
import { CartProvider } from "@/store/cart";
import { WishlistProvider } from "@/store/wishlist";
import { AuthProvider } from "@/components/AuthContext";
import { Suspense, useEffect, type ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  useEffect(() => {
    MiniKit.install(process.env.NEXT_PUBLIC_APP_ID);
    // Eruda mobile console for debugging
    import("eruda").then((eruda) => eruda.default.init());
  }, []);

  return (
    <Suspense>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>{children}</WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </Suspense>
  );
}
