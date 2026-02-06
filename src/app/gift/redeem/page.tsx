"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/components/AuthContext";
import { PickupSelector } from "@/components/PickupSelector";
import type { PickupLocation } from "@/data/pickup-locations";

type GiftInfo = {
  giftCode: string;
  items: { productName: string; quantity: number; price: number }[];
  totalWLD: number;
  totalUSDC: number;
  currency: "WLD" | "USDC";
  status: string;
  message?: string;
  expiresAt: string;
};

export default function GiftRedeemPage() {
  const { isLoggedIn, isVerified } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [code, setCode] = useState(searchParams.get("code") || "");
  const [gift, setGift] = useState<GiftInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<PickupLocation | null>(null);
  const [pickupCode, setPickupCode] = useState<string | null>(null);
  const [redeeming, setRedeeming] = useState(false);

  const authenticated = isLoggedIn && isVerified;

  // Auto-fetch if code from URL param
  useEffect(() => {
    const urlCode = searchParams.get("code");
    if (urlCode && authenticated) {
      setCode(urlCode);
      fetchGift(urlCode);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, authenticated]);

  if (!authenticated) {
    return (
      <div className="flex min-h-[80dvh] flex-col items-center justify-center px-6 text-center">
        <span className="mb-4 text-5xl">📬</span>
        <h2 className="mb-2 text-xl font-bold">선물 받기</h2>
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

  const fetchGift = async (giftCode: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/gift/${giftCode.toUpperCase()}`);
      const data = await res.json();
      if (data.gift) {
        setGift(data.gift);
      } else {
        setError(data.error || "선물을 찾을 수 없습니다");
      }
    } catch {
      setError("오류가 발생했습니다");
    } finally {
      setLoading(false);
    }
  };

  const handleLookup = () => {
    if (!code.trim()) return;
    fetchGift(code.trim());
  };

  const handleRedeem = async () => {
    if (!gift || !selectedLocation) return;
    setRedeeming(true);
    setError(null);
    try {
      const res = await fetch("/api/gift/redeem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: gift.giftCode,
          pickupLocationId: selectedLocation.id,
        }),
      });
      const data = await res.json();
      if (data.status === "success") {
        setPickupCode(data.pickupCode);
      } else {
        setError(data.error || "수령에 실패했습니다");
      }
    } catch {
      setError("오류가 발생했습니다");
    } finally {
      setRedeeming(false);
    }
  };

  // Success screen
  if (pickupCode) {
    return (
      <div className="flex min-h-[80dvh] flex-col items-center justify-center px-6 text-center">
        <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-green-100 text-5xl">
          🎉
        </div>
        <h2 className="mb-2 text-2xl font-bold">선물 수령 완료!</h2>
        <p className="mb-6 text-sm text-muted">아래 픽업코드로 상품을 찾아가세요</p>
        <div className="mb-6 w-full rounded-2xl bg-surface p-6 shadow-sm">
          <p className="mb-1 text-xs text-muted">픽업 코드</p>
          <p className="text-4xl font-bold tracking-widest text-primary">{pickupCode}</p>
          {selectedLocation && (
            <div className="mt-4 border-t border-border pt-4">
              <p className="text-xs text-muted">수령지</p>
              <p className="text-sm font-semibold">{selectedLocation.name}</p>
              <p className="text-xs text-muted">{selectedLocation.address}</p>
            </div>
          )}
        </div>
        <button
          onClick={() => router.push("/")}
          className="w-full rounded-2xl bg-primary py-4 text-lg font-semibold text-white"
        >
          홈으로 돌아가기
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

      <h1 className="mb-2 text-2xl font-bold">선물 받기</h1>
      <p className="mb-6 text-xs text-muted">선물 코드를 입력하세요</p>

      {/* Code input */}
      {!gift && (
        <div className="mb-6">
          <div className="flex gap-2">
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="선물 코드 8자리"
              maxLength={8}
              className="flex-1 rounded-xl border border-border bg-surface px-4 py-3 text-center text-lg font-mono font-bold tracking-widest placeholder:text-muted/50 focus:border-primary focus:outline-none"
              onKeyDown={(e) => e.key === "Enter" && handleLookup()}
            />
            <button
              onClick={handleLookup}
              disabled={loading || !code.trim()}
              className="shrink-0 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white disabled:opacity-50"
            >
              {loading ? "..." : "확인"}
            </button>
          </div>
          {error && (
            <p className="mt-2 text-center text-sm text-red-500">{error}</p>
          )}
        </div>
      )}

      {/* Gift info */}
      {gift && (
        <>
          {gift.status !== "paid" ? (
            <div className="mb-6 rounded-2xl bg-surface p-5 shadow-sm text-center">
              <span className="mb-2 block text-4xl">
                {gift.status === "redeemed" ? "✅" : "⏰"}
              </span>
              <p className="font-semibold">
                {gift.status === "redeemed" ? "이미 수령된 선물입니다" : "만료된 선물입니다"}
              </p>
            </div>
          ) : (
            <>
              <div className="mb-6 rounded-2xl bg-surface p-5 shadow-sm">
                <h2 className="mb-3 text-sm font-semibold text-muted">선물 내용</h2>
                {gift.items.map((item, i) => (
                  <div key={i} className="flex items-center justify-between py-1">
                    <span className="text-sm">{item.productName} x{item.quantity}</span>
                    <span className="text-sm font-medium">{(item.price * item.quantity).toFixed(2)} WLD</span>
                  </div>
                ))}
                <div className="mt-3 border-t border-border pt-3 flex justify-between">
                  <span className="text-sm font-semibold">합계</span>
                  <span className="text-lg font-bold text-primary">{gift.totalWLD.toFixed(2)} WLD</span>
                </div>
                {gift.message && (
                  <div className="mt-4 rounded-xl bg-primary/5 p-3">
                    <p className="text-xs text-muted mb-1">보낸 분의 메시지</p>
                    <p className="text-sm">{gift.message}</p>
                  </div>
                )}
              </div>

              {/* Pickup location */}
              <div className="mb-8">
                <PickupSelector
                  selected={selectedLocation}
                  onSelect={setSelectedLocation}
                />
              </div>

              {error && (
                <p className="mb-4 text-center text-sm text-red-500">{error}</p>
              )}

              <button
                onClick={handleRedeem}
                disabled={redeeming || !selectedLocation}
                className="w-full rounded-2xl bg-primary py-4 text-lg font-semibold text-white transition-all hover:bg-primary-dark active:scale-[0.98] disabled:opacity-50"
              >
                {redeeming ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    수령 처리 중...
                  </span>
                ) : (
                  "선물 수령하기"
                )}
              </button>

              {!selectedLocation && (
                <p className="mt-2 text-center text-xs text-muted">수령지를 선택해주세요</p>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
