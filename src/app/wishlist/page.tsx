"use client";

import { useWishlist } from "@/store/wishlist";
import { products } from "@/data/products";
import { ProductCard } from "@/components/ProductCard";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthContext";

export default function WishlistPage() {
  const { items } = useWishlist();
  const { isVerified } = useAuth();
  const router = useRouter();

  if (!isVerified) {
    return (
      <div className="flex min-h-[80dvh] flex-col items-center justify-center px-6 text-center">
        <span className="mb-4 text-6xl">🔒</span>
        <h2 className="mb-2 text-xl font-bold">로그인이 필요합니다</h2>
        <button onClick={() => router.push("/")} className="mt-4 rounded-2xl bg-primary px-6 py-3 font-semibold text-white">홈으로</button>
      </div>
    );
  }

  const wishedProducts = products.filter((p) => items.includes(p.id));

  if (wishedProducts.length === 0) {
    return (
      <div className="flex min-h-[80dvh] flex-col items-center justify-center px-6 text-center">
        <span className="mb-4 text-6xl">🤍</span>
        <h2 className="mb-2 text-xl font-bold">위시리스트가 비어있습니다</h2>
        <p className="mb-6 text-sm text-muted">마음에 드는 상품에 하트를 눌러보세요</p>
        <button onClick={() => router.push("/products")} className="rounded-2xl bg-primary px-6 py-3 font-semibold text-white">쇼핑하러 가기</button>
      </div>
    );
  }

  return (
    <div className="px-6 pt-6 pb-8">
      <h1 className="mb-4 text-2xl font-bold">위시리스트</h1>
      <p className="mb-4 text-sm text-muted">{wishedProducts.length}개 상품</p>
      <div className="grid grid-cols-2 gap-3">
        {wishedProducts.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}
