"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthContext";

type Order = {
  id: string;
  pickupCode: string;
  location: {
    name: string;
    address: string;
  } | null;
  items: { name: string; quantity: number; price: number }[];
  total: number;
  currency: "WLD" | "USDC";
  date: string;
  status: "ready" | "picked_up";
};

export default function OrdersPage() {
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("love-yourself-orders");
      if (saved) {
        setOrders(JSON.parse(saved));
      }
    } catch {
      // ignore
    }
  }, []);

  if (!isLoggedIn) {
    return (
      <div className="flex min-h-[80dvh] flex-col items-center justify-center px-6 text-center">
        <span className="mb-4 text-6xl">🔒</span>
        <h2 className="mb-2 text-xl font-bold">로그인이 필요합니다</h2>
        <button
          onClick={() => router.push("/")}
          className="mt-4 rounded-2xl bg-primary px-6 py-3 font-semibold text-white"
        >
          홈으로
        </button>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="flex min-h-[80dvh] flex-col items-center justify-center px-6 text-center">
        <span className="mb-4 text-6xl">📦</span>
        <h2 className="mb-2 text-xl font-bold">주문 내역이 없습니다</h2>
        <p className="mb-6 text-sm text-muted">
          첫 주문을 시작해보세요
        </p>
        <button
          onClick={() => router.push("/products")}
          className="rounded-2xl bg-primary px-6 py-3 font-semibold text-white"
        >
          쇼핑하러 가기
        </button>
      </div>
    );
  }

  return (
    <div className="px-6 pt-6 pb-8">
      <h1 className="mb-4 text-2xl font-bold">주문 내역</h1>

      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="rounded-2xl bg-surface p-4 shadow-sm"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  order.status === "ready"
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-muted"
                }`}
              >
                {order.status === "ready" ? "수령 대기" : "수령 완료"}
              </span>
              <span className="text-xs text-muted">
                {new Date(order.date).toLocaleDateString("ko-KR")}
              </span>
            </div>

            {/* Pickup code */}
            <div className="mb-3 rounded-xl bg-primary/5 p-3 text-center">
              <p className="text-xs text-muted mb-1">수령 코드</p>
              <p className="text-2xl font-bold tracking-widest text-primary">
                {order.pickupCode}
              </p>
            </div>

            {/* Location */}
            {order.location && (
              <div className="mb-3">
                <p className="text-xs text-muted">수령지</p>
                <p className="text-sm font-semibold">{order.location.name}</p>
                <p className="text-xs text-muted">{order.location.address}</p>
              </div>
            )}

            {/* Items */}
            <div className="border-t border-border pt-3">
              {order.items.map((item, i) => (
                <div key={i} className="flex justify-between py-1">
                  <span className="text-xs text-muted">
                    {item.name} x{item.quantity}
                  </span>
                  <span className="text-xs font-medium">
                    {(item.price * item.quantity).toFixed(2)} WLD
                  </span>
                </div>
              ))}
              <div className="mt-2 flex justify-between border-t border-border pt-2">
                <span className="text-sm font-semibold">합계</span>
                <span className="text-sm font-bold text-primary">
                  {order.total.toFixed(2)} {order.currency}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
