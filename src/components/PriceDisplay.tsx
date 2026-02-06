"use client";

import { useState, useEffect } from "react";

type Props = {
  wldAmount: number;
  usdcAmount: number;
  showBoth?: boolean;
  size?: "sm" | "md" | "lg";
};

export function PriceDisplay({ wldAmount, usdcAmount, showBoth = false, size = "md" }: Props) {
  const [wldPrice, setWldPrice] = useState(6.0);

  useEffect(() => {
    fetch("/api/prices")
      .then((r) => r.json())
      .then((data) => {
        const price = data?.prices?.WLD?.usd;
        if (price) setWldPrice(price);
      })
      .catch(() => {});
  }, []);

  const usdValue = wldAmount * wldPrice;

  const sizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-xl",
  };

  return (
    <div className={sizeClasses[size]}>
      <span className="font-bold text-primary">{wldAmount} WLD</span>
      <span className="ml-1 text-muted text-xs">(≈${usdValue.toFixed(2)})</span>
      {showBoth && (
        <span className="ml-2 text-muted text-xs">/ {usdcAmount} USDC</span>
      )}
    </div>
  );
}
