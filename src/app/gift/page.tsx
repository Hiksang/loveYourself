"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthContext";

type GiftSummary = {
  giftCode: string;
  items: { productName: string; quantity: number }[];
  currency: "WLD" | "USDC";
  totalWLD: number;
  totalUSDC: number;
  status: string;
  createdAt: string;
};

export default function GiftHubPage() {
  const { isLoggedIn, isVerified, nullifierHash } = useAuth();
  const router = useRouter();
  const [myGifts, setMyGifts] = useState<GiftSummary[]>([]);

  const authenticated = isLoggedIn && isVerified;

  useEffect(() => {
    if (!authenticated || !nullifierHash) return;
    fetch("/api/gift/my-gifts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nullifierHash }),
    })
      .then((r) => r.json())
      .then((data) => setMyGifts(data.gifts || []))
      .catch(() => {});
  }, [authenticated, nullifierHash]);

  if (!authenticated) {
    return (
      <div className="flex min-h-[80dvh] flex-col items-center justify-center px-6 text-center">
        <span className="mb-4 text-5xl">🎁</span>
        <h2 className="mb-2 text-xl font-bold">익명 선물하기</h2>
        <p className="mb-6 text-sm text-muted">성인 인증 후 이용할 수 있습니다</p>
        <button
          onClick={() => router.push("/")}
          className="rounded-2xl bg-primary px-6 py-3 font-semibold text-white"
        >
          홈으로 이동
        </button>
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
      <h1 className="mb-4 text-2xl font-bold">익명 선물하기</h1>

      <div className="mb-8 space-y-3">
        {/* Create gift card */}
        <button
          onClick={() => router.push("/gift/create")}
          className="w-full rounded-2xl bg-gradient-to-r from-primary to-accent p-5 text-left shadow-sm"
        >
          <span className="mb-2 block text-3xl">🎁</span>
          <h3 className="text-lg font-bold text-white">선물 만들기</h3>
          <p className="text-sm text-white/80">상품을 골라 익명으로 선물하세요</p>
        </button>

        {/* Redeem gift card */}
        <button
          onClick={() => router.push("/gift/redeem")}
          className="w-full rounded-2xl bg-surface p-5 text-left shadow-sm transition-all hover:shadow-md"
        >
          <span className="mb-2 block text-3xl">📬</span>
          <h3 className="text-lg font-bold">선물 받기</h3>
          <p className="text-sm text-muted">선물 코드를 입력해서 받으세요</p>
        </button>
      </div>

      {/* My sent gifts */}
      {myGifts.length > 0 && (
        <div>
          <h2 className="mb-3 text-sm font-semibold text-muted">보낸 선물</h2>
          <div className="space-y-2">
            {myGifts.map((gift) => (
              <div key={gift.giftCode} className="rounded-xl bg-surface p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold">
                      {gift.items.map((i) => i.productName).join(", ")}
                    </p>
                    <p className="text-xs text-muted">
                      코드: <span className="font-mono font-bold text-primary">{gift.giftCode}</span>
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      gift.status === "paid"
                        ? "bg-yellow-100 text-yellow-700"
                        : gift.status === "redeemed"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-muted"
                    }`}
                  >
                    {gift.status === "paid" ? "대기중" : gift.status === "redeemed" ? "수령됨" : "만료"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
