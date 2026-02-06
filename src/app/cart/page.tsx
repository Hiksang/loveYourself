"use client";

import { useCart } from "@/store/cart";
import { CartItem } from "@/components/CartItem";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthContext";

export default function CartPage() {
  const { items, totalWLD, totalUSDC, itemCount } = useCart();
  const { isVerified } = useAuth();
  const router = useRouter();

  if (!isVerified) {
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

  if (items.length === 0) {
    return (
      <div className="flex min-h-[80dvh] flex-col items-center justify-center px-6 text-center">
        <span className="mb-4 text-6xl">🛒</span>
        <h2 className="mb-2 text-xl font-bold">장바구니가 비어있습니다</h2>
        <p className="mb-6 text-sm text-muted">
          마음에 드는 상품을 담아보세요
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
      <h1 className="mb-4 text-2xl font-bold">장바구니</h1>

      <div className="mb-2 text-sm text-muted">{itemCount}개 상품</div>

      <div className="mb-6 space-y-3">
        {items.map((item) => (
          <CartItem key={item.product.id} item={item} />
        ))}
      </div>

      {/* Total */}
      <div className="mb-6 rounded-2xl bg-surface p-4 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-muted">총 결제금액</span>
          <div className="text-right">
            <div className="text-xl font-bold text-primary">
              {totalWLD.toFixed(2)} WLD
            </div>
            <div className="text-sm text-muted">(${totalUSDC.toFixed(2)} USDC)</div>
          </div>
        </div>
        <p className="text-xs text-muted">가스비 무료 · 개인정보 수집 없음</p>
      </div>

      <button
        onClick={() => router.push("/checkout")}
        className="w-full rounded-2xl bg-primary py-4 text-lg font-semibold text-white transition-all hover:bg-primary-dark active:scale-[0.98]"
      >
        주문하기
      </button>
    </div>
  );
}
