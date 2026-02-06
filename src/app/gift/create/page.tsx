"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthContext";
import { products } from "@/data/products";
import { PaymentButton } from "@/components/PaymentButton";
import { GiftCodeDisplay } from "@/components/GiftCodeDisplay";

type CartItem = {
  productId: string;
  productName: string;
  image: string;
  quantity: number;
  price: number;
  priceUSDC: number;
};

export default function GiftCreatePage() {
  const { isLoggedIn, isVerified, nullifierHash } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedItems, setSelectedItems] = useState<CartItem[]>([]);
  const [message, setMessage] = useState("");
  const [currency, setCurrency] = useState<"WLD" | "USDC">("WLD");
  const [giftCode, setGiftCode] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const authenticated = isLoggedIn && isVerified;

  if (!authenticated) {
    router.push("/");
    return null;
  }

  const totalWLD = selectedItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const totalUSDC = selectedItems.reduce((sum, i) => sum + i.priceUSDC * i.quantity, 0);
  const amount = currency === "WLD" ? totalWLD : totalUSDC;

  const updateQuantity = (productId: string, delta: number) => {
    setSelectedItems((prev) => {
      const existing = prev.find((i) => i.productId === productId);
      if (!existing && delta > 0) {
        const product = products.find((p) => p.id === productId)!;
        return [...prev, { productId, productName: product.name, image: product.image, quantity: 1, price: product.price, priceUSDC: product.priceUSDC }];
      }
      if (existing) {
        const newQty = existing.quantity + delta;
        if (newQty <= 0) return prev.filter((i) => i.productId !== productId);
        return prev.map((i) => (i.productId === productId ? { ...i, quantity: newQty } : i));
      }
      return prev;
    });
  };

  const handlePaymentSuccess = async (result: { pickupCode: string; transactionId: string }) => {
    // After payment, confirm gift creation
    try {
      const res = await fetch("/api/gift/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentPayload: { reference: result.transactionId.replace("dev_tx_", "") },
          giftData: {
            items: selectedItems.map((i) => ({
              productId: i.productId,
              productName: i.productName,
              quantity: i.quantity,
              price: i.price,
              priceUSDC: i.priceUSDC,
            })),
            totalWLD,
            totalUSDC,
            currency,
            message: message.trim() || undefined,
            nullifierHash,
            reference: result.transactionId.replace("dev_tx_", ""),
          },
        }),
      });
      const data = await res.json();
      if (data.status === "success") {
        setGiftCode(data.giftCode);
        setExpiresAt(data.expiresAt);
        setStep(3);
      } else {
        setError(data.error || "선물 생성에 실패했습니다");
      }
    } catch {
      setError("오류가 발생했습니다");
    }
  };

  // Step 3: Gift code display
  if (step === 3 && giftCode) {
    return (
      <div className="flex min-h-[80dvh] flex-col items-center justify-center px-6">
        <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-green-100 text-5xl">
          🎁
        </div>
        <h2 className="mb-2 text-2xl font-bold">선물 준비 완료!</h2>
        <p className="mb-6 text-sm text-muted">아래 코드를 상대방에게 전달하세요</p>
        <div className="mb-6 w-full">
          <GiftCodeDisplay code={giftCode} expiresAt={expiresAt || undefined} />
        </div>
        <button
          onClick={() => router.push("/gift")}
          className="w-full rounded-2xl bg-surface py-4 text-lg font-semibold shadow-sm"
        >
          선물 허브로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className="px-6 pt-6 pb-8">
      <button
        onClick={() => (step === 2 ? setStep(1) : router.back())}
        className="mb-4 text-sm text-muted hover:text-foreground transition-colors"
      >
        ← 뒤로
      </button>

      <h1 className="mb-2 text-2xl font-bold">선물 만들기</h1>
      <p className="mb-6 text-xs text-muted">
        {step === 1 ? "선물할 상품을 선택하세요" : "메시지를 작성하고 결제하세요"}
      </p>

      {/* Step indicator */}
      <div className="mb-6 flex items-center gap-2">
        <div className={`h-1 flex-1 rounded-full ${step >= 1 ? "bg-primary" : "bg-border"}`} />
        <div className={`h-1 flex-1 rounded-full ${step >= 2 ? "bg-primary" : "bg-border"}`} />
      </div>

      {step === 1 && (
        <>
          {/* Product selection */}
          <div className="space-y-2">
            {products.map((product) => {
              const item = selectedItems.find((i) => i.productId === product.id);
              const qty = item?.quantity || 0;
              return (
                <div key={product.id} className="flex items-center gap-3 rounded-xl bg-surface p-3 shadow-sm">
                  <span className="text-2xl">{product.image}</span>
                  <div className="flex-1">
                    <p className="text-sm font-semibold">{product.name}</p>
                    <p className="text-xs text-muted">{product.price} WLD</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {qty > 0 && (
                      <button
                        onClick={() => updateQuantity(product.id, -1)}
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-sm font-bold"
                      >
                        -
                      </button>
                    )}
                    {qty > 0 && <span className="w-5 text-center text-sm font-bold">{qty}</span>}
                    <button
                      onClick={() => updateQuantity(product.id, 1)}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary"
                    >
                      +
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {selectedItems.length > 0 && (
            <div className="mt-6">
              <div className="mb-4 rounded-xl bg-primary/5 p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold">선물 합계</span>
                  <span className="text-lg font-bold text-primary">{totalWLD.toFixed(2)} WLD</span>
                </div>
              </div>
              <button
                onClick={() => setStep(2)}
                className="w-full rounded-2xl bg-primary py-4 text-lg font-semibold text-white transition-all hover:bg-primary-dark active:scale-[0.98]"
              >
                다음
              </button>
            </div>
          )}
        </>
      )}

      {step === 2 && (
        <>
          {/* Order summary */}
          <div className="mb-8 rounded-2xl bg-surface p-4 shadow-sm">
            <h2 className="mb-2 text-sm font-semibold text-muted">선물 상품</h2>
            {selectedItems.map((item) => (
              <div key={item.productId} className="flex items-center justify-between py-1">
                <span className="text-sm">{item.image} {item.productName} x{item.quantity}</span>
                <span className="text-sm font-medium">{(item.price * item.quantity).toFixed(2)} WLD</span>
              </div>
            ))}
          </div>

          {/* Message */}
          <div className="mb-4">
            <label className="mb-2 block text-sm font-semibold">선물 메시지 (선택)</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="받는 분에게 전할 메시지..."
              rows={3}
              maxLength={200}
              className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm placeholder:text-muted/50 focus:border-primary focus:outline-none resize-none"
            />
          </div>

          {/* Currency selection */}
          <div className="mb-4">
            <h2 className="mb-2 text-sm font-semibold">결제 수단</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrency("WLD")}
                className={`flex-1 rounded-xl py-3 text-sm font-medium transition-colors ${
                  currency === "WLD" ? "bg-primary text-white" : "bg-surface text-muted border border-border"
                }`}
              >
                WLD ({totalWLD.toFixed(2)})
              </button>
              <button
                onClick={() => setCurrency("USDC")}
                className={`flex-1 rounded-xl py-3 text-sm font-medium transition-colors ${
                  currency === "USDC" ? "bg-primary text-white" : "bg-surface text-muted border border-border"
                }`}
              >
                USDC (${totalUSDC.toFixed(2)})
              </button>
            </div>
          </div>

          {error && (
            <p className="mb-4 text-center text-sm text-red-500">{error}</p>
          )}

          <PaymentButton
            amount={amount}
            currency={currency}
            description="Love Yourself 선물 결제"
            onSuccess={handlePaymentSuccess}
            onError={(err) => setError(err)}
          />
        </>
      )}
    </div>
  );
}
