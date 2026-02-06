"use client";

import { useAuth } from "@/components/AuthContext";

export function Header() {
  const { isLoggedIn, isVerified, walletAddress } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm px-6 py-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold tracking-tight">
          <span className="text-primary">Love</span> Yourself
        </h1>
        {isLoggedIn && (
          <div className="flex items-center gap-2">
            {isVerified && (
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-xs">
                ✓
              </span>
            )}
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              {walletAddress?.slice(0, 4)}...{walletAddress?.slice(-3)}
            </span>
          </div>
        )}
      </div>
    </header>
  );
}
