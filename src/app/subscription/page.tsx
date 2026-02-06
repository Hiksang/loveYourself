"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthContext";
import { subscriptionPlans, type SubscriptionPlan } from "@/data/subscriptions";
import { MiniKit, tokenToDecimals, Tokens } from "@worldcoin/minikit-js";

export default function SubscriptionPage() {
  const { isVerified } = useAuth();
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [subscribing, setSubscribing] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  if (!isVerified) {
    return (
      <div className="flex min-h-[80dvh] flex-col items-center justify-center px-6 text-center">
        <span className="mb-4 text-6xl">🔒</span>
        <h2 className="mb-2 text-xl font-bold">로그인이 필요합니다</h2>
        <button onClick={() => router.push("/")} className="mt-4 rounded-2xl bg-primary px-6 py-3 font-semibold text-white">홈으로</button>
      </div>
    );
  }

  const handleSubscribe = async (plan: SubscriptionPlan) => {
    setSubscribing(true);
    setSelectedPlan(plan);

    try {
      // Initiate payment
      const initRes = await fetch("/api/initiate-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: plan.priceWLD }),
      });
      const { id: reference } = await initRes.json();

      if (!MiniKit.isInstalled()) {
        // Dev fallback
        setSubscribed(true);
        setSubscribing(false);
        return;
      }

      const { finalPayload } = await MiniKit.commandsAsync.pay({
        reference,
        to: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
        tokens: [{
          symbol: Tokens.WLD,
          token_amount: tokenToDecimals(plan.priceWLD, Tokens.WLD).toString(),
        }],
        description: `Love Yourself ${plan.name} 구독`,
      });

      if (finalPayload.status === "success") {
        await fetch("/api/confirm-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(finalPayload),
        });
        setSubscribed(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubscribing(false);
    }
  };

  if (subscribed && selectedPlan) {
    return (
      <div className="flex min-h-[80dvh] flex-col items-center justify-center px-6 text-center">
        <div className="mb-6 text-6xl">{selectedPlan.icon}</div>
        <h2 className="mb-2 text-2xl font-bold">구독 완료!</h2>
        <p className="mb-2 text-sm text-muted">{selectedPlan.name}에 가입되었습니다</p>
        <p className="mb-6 text-xs text-muted">매월 자동으로 서프라이즈 박스가 배송됩니다</p>
        <button
          onClick={() => router.push("/orders")}
          className="rounded-2xl bg-primary px-6 py-3 font-semibold text-white"
        >
          주문 내역 보기
        </button>
      </div>
    );
  }

  return (
    <div className="px-6 pt-6 pb-8">
      <h1 className="mb-3 text-2xl font-bold">구독 박스</h1>
      <p className="mb-8 text-sm text-muted">매월 새로운 셀프케어 아이템을 만나보세요</p>

      <div className="space-y-4">
        {subscriptionPlans.map((plan) => (
          <div
            key={plan.id}
            className={`relative rounded-2xl bg-surface p-5 shadow-sm transition-all ${
              plan.popular ? "border-2 border-primary" : "border border-border"
            }`}
          >
            {plan.popular && (
              <span className="absolute -top-3 left-4 rounded-full bg-primary px-3 py-0.5 text-xs font-bold text-white">
                인기
              </span>
            )}

            <div className="flex items-start gap-3 mb-3">
              <span className="text-3xl">{plan.icon}</span>
              <div className="flex-1">
                <h3 className="font-bold">{plan.name}</h3>
                <p className="text-xs text-muted">{plan.description}</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-primary">{plan.priceWLD} WLD</p>
                <p className="text-xs text-muted">/ 월</p>
              </div>
            </div>

            <div className="mb-4 space-y-1.5">
              {plan.items.map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-muted">
                  <span className="text-primary">✓</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => handleSubscribe(plan)}
              disabled={subscribing}
              className={`w-full rounded-xl py-3 text-sm font-semibold transition-all active:scale-[0.98] disabled:opacity-50 ${
                plan.popular
                  ? "bg-primary text-white hover:bg-primary-dark"
                  : "bg-primary/10 text-primary hover:bg-primary/20"
              }`}
            >
              {subscribing && selectedPlan?.id === plan.id ? "처리 중..." : "구독하기"}
            </button>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-xl bg-primary/5 p-4">
        <p className="text-xs text-primary font-medium mb-1">🔒 프라이버시 보호 구독</p>
        <p className="text-xs text-muted leading-relaxed">
          구독 정보는 온체인에 암호화되어 저장됩니다.
          언제든지 해지 가능하며, 개인정보는 수집하지 않습니다.
        </p>
      </div>
    </div>
  );
}
