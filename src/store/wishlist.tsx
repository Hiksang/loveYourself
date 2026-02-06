"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";

type WishlistContextType = {
  items: string[]; // product IDs
  addItem: (productId: string) => void;
  removeItem: (productId: string) => void;
  toggleItem: (productId: string) => void;
  isWished: (productId: string) => boolean;
  count: number;
};

const WishlistContext = createContext<WishlistContextType | null>(null);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<string[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("love-yourself-wishlist");
      if (saved) setItems(JSON.parse(saved));
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("love-yourself-wishlist", JSON.stringify(items));
    } catch {}
  }, [items]);

  const addItem = useCallback((id: string) => {
    setItems((prev) => (prev.includes(id) ? prev : [...prev, id]));
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i !== id));
  }, []);

  const toggleItem = useCallback((id: string) => {
    setItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  }, []);

  const isWished = useCallback((id: string) => items.includes(id), [items]);

  return (
    <WishlistContext.Provider
      value={{ items, addItem, removeItem, toggleItem, isWished, count: items.length }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}
