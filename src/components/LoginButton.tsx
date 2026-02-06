"use client";

import { MiniKit } from "@worldcoin/minikit-js";
import { useAuth } from "@/components/AuthContext";
import { useState } from "react";

export function LoginButton() {
  const { isLoggedIn, walletAddress, login, logout } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!MiniKit.isInstalled()) {
      // Dev fallback: simulate login
      login("0xdev_test_address");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/nonce");
      const { nonce } = await res.json();

      const { finalPayload } = await MiniKit.commandsAsync.walletAuth({
        nonce,
        expirationTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        statement: "Love Yourself에 로그인합니다",
      });

      if (finalPayload.status === "error") {
        return;
      }

      const response = await fetch("/api/complete-siwe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ payload: finalPayload, nonce }),
      });

      const result = await response.json();
      if (result.status === "success") {
        login(result.address);
      }
    } catch (err) {
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (isLoggedIn) {
    return (
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2">
          <div className="h-2 w-2 rounded-full bg-green-500" />
          <span className="text-sm font-medium text-primary">
            {walletAddress?.slice(0, 6)}...{walletAddress?.slice(-4)}
          </span>
        </div>
        <button
          onClick={logout}
          className="text-sm text-muted hover:text-foreground transition-colors"
        >
          로그아웃
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleLogin}
      disabled={loading}
      className="w-full rounded-2xl bg-primary px-6 py-4 text-lg font-semibold text-white transition-all hover:bg-primary-dark active:scale-[0.98] disabled:opacity-50"
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
          연결 중...
        </span>
      ) : (
        "지갑으로 로그인"
      )}
    </button>
  );
}
