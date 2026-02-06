"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/store/cart";
import { useAuth } from "@/components/AuthContext";
import { PickupSelector } from "@/components/PickupSelector";
import { PaymentButton } from "@/components/PaymentButton";
import type { PickupLocation } from "@/data/pickup-locations";

type OrderResult = {
  pickupCode: string;
  transactionId: string;
};

export default function CheckoutPage() {
  const { items, totalWLD, totalUSDC, clearCart } = useCart();
  const { isVerified } = useAuth();
  const router = useRouter();
  const [selectedLocation, setSelectedLocation] = useState<PickupLocation | null>(null);
  const [currency, setCurrency] = useState<"WLD" | "USDC">("WLD");
  const [orderResult, setOrderResult] = useState<OrderResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isVerified) {
    router.push("/");
    return null;
  }

  if (items.length === 0 && !orderResult) {
    router.push("/cart");
    return null;
  }

  // Success screen
  if (orderResult) {
    return (
      <div className="flex min-h-[80vh] flex-col items-center justify-center px-6 text-center">
        <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-green-100 text-5xl">
          ✓
        </div>
        <h2 className="mb-2 text-2xl font-bold">주문 완료!</h2>
        <p className="mb-6 text-sm text-muted">
          아래 수령 코드로 상품을 찾아가세요
        </p>

        <div className="mb-6 w-full rounded-2xl bg-surface p-6 shadow-sm">
          <p className="mb-1 text-xs text-muted">수령 코드</p>
          <p className="text-4xl font-bold tracking-widest text-primary">
            {orderResult.pickupCode}
          </p>
          {selectedLocation && (
            <div className="mt-4 border-t border-border pt-4">
              <p className="text-xs text-muted">수령지</p>
              <p className="text-sm font-semibold">{selectedLocation.name}</p>
              <p className="text-xs text-muted">{selectedLocation.address}</p>
            </div>
          )}
        </div>

        <button
          onClick={() => {
            // Save order to localStorage for order history
            const orders = JSON.parse(
              localStorage.getItem("love-yourself-orders") || "[]"
            );
            orders.unshift({
              id: orderResult.transactionId,
              pickupCode: orderResult.pickupCode,
              location: selectedLocation,
              items: items.map((i) => ({
                name: i.product.name,
                quantity: i.quantity,
                price: i.product.price,
              })),
              total: currency === "WLD" ? totalWLD : totalUSDC,
              currency,
              date: new Date().toISOString(),
              status: "ready",
            });
            localStorage.setItem(
              "love-yourself-orders",
              JSON.stringify(orders)
            );
            clearCart();
            router.push("/orders");
          }}
          className="w-full rounded-2xl bg-primary py-4 text-lg font-semibold text-white"
        >
          주문 내역 보기
        </button>
      </div>
    );
  }

  const amount = currency === "WLD" ? totalWLD : totalUSDC;

  return (
    <div className="px-6 pt-6 pb-8">
      <button
        onClick={() => router.back()}
        className="mb-4 text-sm text-muted hover:text-foreground transition-colors"
      >
        ← 뒤로
      </button>

      <h1 className="mb-6 text-2xl font-bold">주문하기</h1>

      {/* Order summary */}
      <div className="mb-6 rounded-2xl bg-surface p-4 shadow-sm">
        <h2 className="mb-3 text-sm font-semibold text-muted">주문 상품</h2>
        {items.map((item) => (
          <div
            key={item.product.id}
            className="flex items-center justify-between py-2"
          >
            <div className="flex items-center gap-2">
              <span>{item.product.image}</span>
              <span className="text-sm">{item.product.name}</span>
              <span className="text-xs text-muted">x{item.quantity}</span>
            </div>
            <span className="text-sm font-medium">
              {(item.product.price * item.quantity).toFixed(2)} WLD
            </span>
          </div>
        ))}
        <div className="mt-3 border-t border-border pt-3 flex items-center justify-between">
          <span className="font-semibold">합계</span>
          <span className="text-lg font-bold text-primary">
            {totalWLD.toFixed(2)} WLD
          </span>
        </div>
      </div>

      {/* Pickup location */}
      <div className="mb-6">
        <PickupSelector
          selected={selectedLocation}
          onSelect={setSelectedLocation}
        />
      </div>

      {/* Currency selection */}
      <div className="mb-6">
        <h2 className="mb-3 text-lg font-bold">결제 수단</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrency("WLD")}
            className={`flex-1 rounded-xl py-3 text-sm font-medium transition-colors ${
              currency === "WLD"
                ? "bg-primary text-white"
                : "bg-surface text-muted border border-border"
            }`}
          >
            🌐 WLD ({totalWLD.toFixed(2)})
          </button>
          <button
            onClick={() => setCurrency("USDC")}
            className={`flex-1 rounded-xl py-3 text-sm font-medium transition-colors ${
              currency === "USDC"
                ? "bg-primary text-white"
                : "bg-surface text-muted border border-border"
            }`}
          >
            💵 USDC (${totalUSDC.toFixed(2)})
          </button>
        </div>
      </div>

      {/* Privacy notice */}
      <div className="mb-6 rounded-xl bg-primary/5 p-4">
        <p className="text-xs text-primary font-medium mb-1">🔒 프라이버시 보호</p>
        <p className="text-xs text-muted leading-relaxed">
          이름, 주소, 결제 기록이 저장되지 않습니다.
          모든 결제는 블록체인에서 익명으로 처리됩니다.
        </p>
      </div>

      {error && (
        <p className="mb-4 text-center text-sm text-red-500">{error}</p>
      )}

      <PaymentButton
        amount={amount}
        currency={currency}
        description="Love Yourself 주문 결제"
        disabled={!selectedLocation}
        onSuccess={(result) => {
          setError(null);
          setOrderResult(result);
        }}
        onError={(err) => setError(err)}
      />

      {!selectedLocation && (
        <p className="mt-2 text-center text-xs text-muted">
          수령지를 선택해주세요
        </p>
      )}
    </div>
  );
}
