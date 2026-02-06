"use client";

import { useWishlist } from "@/store/wishlist";

type Props = {
  productId: string;
  size?: "sm" | "md";
};

export function WishlistButton({ productId, size = "md" }: Props) {
  const { toggleItem, isWished } = useWishlist();
  const wished = isWished(productId);

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleItem(productId);
      }}
      className={`transition-transform active:scale-90 ${
        size === "sm" ? "text-lg" : "text-2xl"
      }`}
      aria-label={wished ? "위시리스트에서 제거" : "위시리스트에 추가"}
    >
      {wished ? "💜" : "🤍"}
    </button>
  );
}
