"use client";

import { useState } from "react";
import { products, categoryNames, type Category } from "@/data/products";
import { ProductCard } from "@/components/ProductCard";
import { useAuth } from "@/components/AuthContext";
import { useRouter } from "next/navigation";

const categories: (Category | "all")[] = ["all", "wellness", "beauty", "health", "special"];

export default function ProductsPage() {
  const [activeCategory, setActiveCategory] = useState<Category | "all">("all");
  const { isVerified } = useAuth();
  const router = useRouter();

  if (!isVerified) {
    return (
      <div className="flex min-h-[80vh] flex-col items-center justify-center px-6 text-center">
        <span className="mb-4 text-6xl">🔒</span>
        <h2 className="mb-2 text-xl font-bold">성인 인증이 필요합니다</h2>
        <p className="mb-6 text-sm text-muted">
          상품을 보시려면 먼저 성인 인증을 완료해주세요
        </p>
        <button
          onClick={() => router.push("/")}
          className="rounded-2xl bg-primary px-6 py-3 font-semibold text-white"
        >
          홈으로 이동
        </button>
      </div>
    );
  }

  const filtered =
    activeCategory === "all"
      ? products
      : products.filter((p) => p.category === activeCategory);

  return (
    <div className="px-6 pt-6">
      <h1 className="mb-4 text-2xl font-bold">상품</h1>

      {/* Category tabs */}
      <div className="mb-6 flex gap-2 overflow-x-auto pb-2 -mx-6 px-6">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              activeCategory === cat
                ? "bg-primary text-white"
                : "bg-surface text-muted hover:bg-gray-100"
            }`}
          >
            {cat === "all" ? "전체" : categoryNames[cat]}
          </button>
        ))}
      </div>

      {/* Product grid */}
      <div className="grid grid-cols-2 gap-3 pb-6">
        {filtered.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
