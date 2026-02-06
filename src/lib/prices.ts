// Token price cache and fetcher
type PriceData = {
  WLD: number; // USD price
  USDC: number;
  updatedAt: Date;
};

let cachedPrices: PriceData | null = null;

export async function getTokenPrices(): Promise<PriceData> {
  // Cache for 60 seconds
  if (cachedPrices && Date.now() - cachedPrices.updatedAt.getTime() < 60000) {
    return cachedPrices;
  }

  try {
    const res = await fetch(
      "https://developer.worldcoin.org/public/v1/miniapps/prices",
      { next: { revalidate: 60 } }
    );
    if (res.ok) {
      const data = await res.json();
      // Extract WLD price from response
      const wldPrice = data?.prices?.WLD?.usd ?? 6.0;
      cachedPrices = {
        WLD: wldPrice,
        USDC: 1.0,
        updatedAt: new Date(),
      };
      return cachedPrices;
    }
  } catch {
    // fallback
  }
  return { WLD: 6.0, USDC: 1.0, updatedAt: new Date() };
}

export function formatUSD(wldAmount: number, wldPrice: number): string {
  return `$${(wldAmount * wldPrice).toFixed(2)}`;
}
