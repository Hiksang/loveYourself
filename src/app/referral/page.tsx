"use client";

import { useAuth } from "@/components/AuthContext";
import { ReferralCard } from "@/components/ReferralCard";
import { useRouter } from "next/navigation";

export default function ReferralPage() {
  const { isLoggedIn } = useAuth();
  const router = useRouter();

  if (!isLoggedIn) {
    return (
      <div className="flex min-h-[80dvh] flex-col items-center justify-center px-6 text-center">
        <span className="mb-4 text-6xl">🔒</span>
        <h2 className="mb-2 text-xl font-bold">로그인이 필요합니다</h2>
        <button onClick={() => router.push("/")} className="mt-4 rounded-2xl bg-primary px-6 py-3 font-semibold text-white">홈으로</button>
      </div>
    );
  }

  return (
    <div className="px-6 pt-6 pb-8">
      <button
        onClick={() => router.back()}
        className="mb-4 text-sm text-muted hover:text-foreground transition-colors"
      >
        ← 뒤로
      </button>
      <h1 className="mb-4 text-2xl font-bold">친구 추천</h1>
      <ReferralCard />

      <div className="mt-8 rounded-2xl bg-surface p-5 shadow-sm">
        <h3 className="mb-3 font-semibold">추천 혜택</h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <span className="text-lg">🎁</span>
            <div>
              <p className="text-sm font-medium">추천인</p>
              <p className="text-xs text-muted">친구가 첫 구매 시 0.1 WLD 할인</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-lg">🎉</span>
            <div>
              <p className="text-sm font-medium">피추천인</p>
              <p className="text-xs text-muted">첫 구매 시 0.05 WLD 할인</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-lg">🔒</span>
            <div>
              <p className="text-sm font-medium">어뷰징 방지</p>
              <p className="text-xs text-muted">World ID nullifier 기반으로 중복 불가</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
