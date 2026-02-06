"use client";

import { useAuth } from "@/components/AuthContext";

export function Header() {
  const { isLoggedIn, isVerified } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm px-6 py-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold tracking-tight">
          <span className="text-primary">Love</span> Yourself
        </h1>
        {isLoggedIn && isVerified && (
          <div className="flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1">
            <div className="h-2 w-2 rounded-full bg-green-500" />
            <span className="text-xs font-medium text-green-700">인증됨</span>
          </div>
        )}
      </div>
    </header>
  );
}
