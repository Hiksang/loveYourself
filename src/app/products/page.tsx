"use client";

import { useState } from "react";
import { products, categoryNames, type Category } from "@/data/products";
import { ProductCard } from "@/components/ProductCard";
import { useAuth } from "@/components/AuthContext";
import { useRouter } from "next/navigation";

const categories: (Category | "all")[] = ["all", "wellness", "beauty", "health", "special"];

export default function ProductsPage() {
  const [activeCategory, setActiveCategory] = useState<Category | "all">("all");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"default" | "price-asc" | "price-desc" | "name">("default");
  const { isVerified } = useAuth();
  const router = useRouter();

  if (!isVerified) {
    return (
      <div className="flex min-h-[80dvh] flex-col items-center justify-center px-6 text-center">
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

  const searched = search.trim()
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.description.toLowerCase().includes(search.toLowerCase())
      )
    : products;

  const filtered =
    activeCategory === "all"
      ? searched
      : searched.filter((p) => p.category === activeCategory);

  let sorted = [...filtered];
  switch (sortBy) {
    case "price-asc":
      sorted.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      sorted.sort((a, b) => b.price - a.price);
      break;
    case "name":
      sorted.sort((a, b) => a.name.localeCompare(b.name, "ko"));
      break;
  }

  return (
    <div className="px-6 pt-6">
      <button
        onClick={() => router.back()}
        className="mb-4 text-sm text-muted hover:text-foreground transition-colors"
      >
        ← 뒤로
      </button>
      <h1 className="mb-4 text-2xl font-bold">상품</h1>

      {/* Search bar */}
      <input
        type="text"
        placeholder="상품 검색..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-6 w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm placeholder:text-muted/50 focus:border-primary focus:outline-none"
      />

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

      {/* Sort buttons */}
      <div className="mb-4 flex gap-2">
        {[
          { key: "default", label: "기본" },
          { key: "price-asc", label: "가격 낮은순" },
          { key: "price-desc", label: "가격 높은순" },
          { key: "name", label: "이름순" },
        ].map((s) => (
          <button
            key={s.key}
            onClick={() => setSortBy(s.key as typeof sortBy)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
              sortBy === s.key
                ? "bg-foreground text-background"
                : "bg-surface text-muted hover:bg-gray-100"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Product grid */}
      <div className="grid grid-cols-2 gap-3 pb-6">
        {sorted.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
        {sorted.length === 0 && (
          <div className="col-span-2 py-12 text-center text-muted">
            검색 결과가 없습니다
          </div>
        )}
      </div>
    </div>
  );
}
