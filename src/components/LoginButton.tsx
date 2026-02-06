"use client";

import { MiniKit, VerificationLevel } from "@worldcoin/minikit-js";
import { useAuth } from "@/components/AuthContext";
import { useState } from "react";

export function LoginButton() {
  const { isLoggedIn, isVerified, walletAddress, login, verify, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleWorldIdLogin = async () => {
    if (!MiniKit.isInstalled()) {
      // Dev fallback: simulate login + verify
      login("0xdev_test_address", "0xDev_nullifier_hash_for_testing");
      verify();
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // World ID Verify = 로그인 + 성인인증 동시 처리
      const { finalPayload } = await MiniKit.commandsAsync.verify({
        action: "age-verify",
        verification_level: VerificationLevel.Orb,
      });

      if (finalPayload.status === "error") {
        setError("인증이 취소되었습니다");
        return;
      }

      // 백엔드에서 증명 검증
      const res = await fetch("/api/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          payload: finalPayload,
          action: "age-verify",
        }),
      });

      const result = await res.json();
      if (result.status === "success") {
        // World ID 인증 성공 → 로그인 + 성인인증 동시 완료
        login(result.nullifierHash, result.nullifierHash);
        verify();
      } else {
        console.error("Verify failed:", result);
        const detail = result.detail ? ` (${result.detail})` : "";
        setError(`인증에 실패했습니다${detail}. 다시 시도해주세요.`);
      }
    } catch (err) {
      console.error("World ID login error:", err);
      setError("오류가 발생했습니다");
    } finally {
      setLoading(false);
    }
  };

  if (isLoggedIn && isVerified) {
    return (
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 rounded-full bg-green-50 px-4 py-2">
          <div className="h-2 w-2 rounded-full bg-green-500" />
          <span className="text-sm font-medium text-green-700">
            World ID 인증됨
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
    <div className="space-y-2">
      <button
        onClick={handleWorldIdLogin}
        disabled={loading}
        className="w-full rounded-2xl bg-primary px-6 py-4 text-lg font-semibold text-white transition-all hover:bg-primary-dark active:scale-[0.98] disabled:opacity-50"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
            인증 중...
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            🌐 World ID로 시작하기
          </span>
        )}
      </button>
      {error && (
        <p className="text-center text-sm text-red-500">{error}</p>
      )}
      <p className="text-center text-xs text-muted">
        영지식증명으로 개인정보 없이 인증합니다
      </p>
    </div>
  );
}
