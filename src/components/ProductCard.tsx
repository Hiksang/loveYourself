"use client";

import Link from "next/link";
import type { Product } from "@/data/products";
import { useCart } from "@/store/cart";

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();

  return (
    <Link
      href={`/products/${product.id}`}
      className="group block rounded-2xl bg-surface p-4 shadow-sm transition-all hover:shadow-md active:scale-[0.98]"
    >
      <div className="mb-3 flex h-28 items-center justify-center rounded-xl bg-gradient-to-br from-primary/5 to-accent/10 text-5xl">
        {product.image}
      </div>
      <h3 className="mb-1 font-semibold text-foreground group-hover:text-primary transition-colors">
        {product.name}
      </h3>
      <p className="mb-3 line-clamp-2 text-xs text-muted leading-relaxed">
        {product.description}
      </p>
      <div className="flex items-center justify-between">
        <div>
          <span className="text-sm font-bold text-primary">{product.price} WLD</span>
          <span className="ml-1 text-xs text-muted">/ ${product.priceUSDC}</span>
        </div>
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            addItem(product);
          }}
          className="rounded-full bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-primary/20"
        >
          담기
        </button>
      </div>
    </Link>
  );
}
