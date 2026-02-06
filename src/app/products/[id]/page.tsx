"use client";

import { useParams, useRouter } from "next/navigation";
import { getProduct, categoryNames } from "@/data/products";
import { useCart } from "@/store/cart";
import { useAuth } from "@/components/AuthContext";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addItem } = useCart();
  const { isVerified } = useAuth();

  const product = getProduct(params.id as string);

  if (!isVerified) {
    router.push("/");
    return null;
  }

  if (!product) {
    return (
      <div className="flex min-h-[80vh] flex-col items-center justify-center px-6 text-center">
        <span className="mb-4 text-5xl">🔍</span>
        <h2 className="mb-2 text-xl font-bold">상품을 찾을 수 없습니다</h2>
        <button
          onClick={() => router.push("/products")}
          className="mt-4 rounded-2xl bg-primary px-6 py-3 font-semibold text-white"
        >
          상품 목록으로
        </button>
      </div>
    );
  }

  const handleAddToCart = () => {
    addItem(product);
    router.push("/cart");
  };

  return (
    <div className="px-6 pt-6 pb-8">
      {/* Back button */}
      <button
        onClick={() => router.back()}
        className="mb-4 flex items-center gap-1 text-sm text-muted hover:text-foreground transition-colors"
      >
        ← 뒤로
      </button>

      {/* Product image */}
      <div className="mb-6 flex h-48 items-center justify-center rounded-3xl bg-gradient-to-br from-primary/5 to-accent/10 text-7xl">
        {product.image}
      </div>

      {/* Category badge */}
      <span className="mb-2 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
        {categoryNames[product.category]}
      </span>

      {/* Product info */}
      <h1 className="mb-2 text-2xl font-bold">{product.name}</h1>
      <p className="mb-6 leading-relaxed text-muted">{product.description}</p>

      {/* Tags */}
      <div className="mb-6 flex flex-wrap gap-2">
        {product.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-gray-100 px-3 py-1 text-xs text-muted"
          >
            #{tag}
          </span>
        ))}
      </div>

      {/* Price */}
      <div className="mb-6 rounded-2xl bg-surface p-4 shadow-sm">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-primary">{product.price} WLD</span>
          <span className="text-lg text-muted">(${product.priceUSDC} USDC)</span>
        </div>
        <p className="mt-1 text-xs text-muted">가스비 무료 · 익명 결제</p>
      </div>

      {/* CTA */}
      <div className="flex gap-3">
        <button
          onClick={handleAddToCart}
          className="flex-1 rounded-2xl bg-primary py-4 text-center text-lg font-semibold text-white transition-all hover:bg-primary-dark active:scale-[0.98]"
        >
          장바구니에 담기
        </button>
      </div>
    </div>
  );
}
