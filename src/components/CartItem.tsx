"use client";

import type { CartItem as CartItemType } from "@/store/cart";
import { useCart } from "@/store/cart";

export function CartItem({ item }: { item: CartItemType }) {
  const { updateQuantity, removeItem } = useCart();

  return (
    <div className="flex items-center gap-4 rounded-2xl bg-surface p-4 shadow-sm">
      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/5 to-accent/10 text-3xl">
        {item.product.image}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-sm truncate">{item.product.name}</h3>
        <p className="text-xs text-muted mt-0.5">
          {item.product.price} WLD / ${item.product.priceUSDC}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-sm font-bold text-muted hover:bg-gray-200 transition-colors"
        >
          -
        </button>
        <span className="w-6 text-center text-sm font-semibold">{item.quantity}</span>
        <button
          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary hover:bg-primary/20 transition-colors"
        >
          +
        </button>
      </div>
      <button
        onClick={() => removeItem(item.product.id)}
        className="text-muted hover:text-red-500 transition-colors text-lg"
        aria-label="삭제"
      >
        ×
      </button>
    </div>
  );
}
