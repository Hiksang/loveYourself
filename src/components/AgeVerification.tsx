"use client";

import { MiniKit, VerificationLevel } from "@worldcoin/minikit-js";
import { useAuth } from "@/components/AuthContext";
import { useState } from "react";

export function AgeVerification() {
  const { isVerified, verify } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleVerify = async () => {
    if (!MiniKit.isInstalled()) {
      // Dev fallback: simulate verification
      verify();
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { finalPayload } = await MiniKit.commandsAsync.verify({
        action: "age-verify",
        verification_level: VerificationLevel.Orb,
      });

      if (finalPayload.status === "error") {
        setError("인증이 취소되었습니다");
        return;
      }

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
        verify();
      } else {
        setError("인증에 실패했습니다. 다시 시도해주세요.");
      }
    } catch (err) {
      console.error("Verification error:", err);
      setError("오류가 발생했습니다");
    } finally {
      setLoading(false);
    }
  };

  if (isVerified) {
    return (
      <div className="flex items-center gap-2 rounded-2xl bg-green-50 px-4 py-3">
        <span className="text-lg">✓</span>
        <span className="text-sm font-medium text-green-700">성인 인증 완료</span>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <button
        onClick={handleVerify}
        disabled={loading}
        className="w-full rounded-2xl border-2 border-primary bg-white px-6 py-4 text-lg font-semibold text-primary transition-all hover:bg-primary/5 active:scale-[0.98] disabled:opacity-50"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            인증 중...
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            <span>🔒</span>
            World ID로 성인 인증
          </span>
        )}
      </button>
      {error && (
        <p className="text-center text-sm text-red-500">{error}</p>
      )}
      <p className="text-center text-xs text-muted">
        영지식증명(ZKP)으로 개인정보 없이 인증합니다
      </p>
    </div>
  );
}
