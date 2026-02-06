import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch(
      "https://developer.worldcoin.org/public/v1/miniapps/prices",
      { next: { revalidate: 60 } }
    );
    if (res.ok) {
      const data = await res.json();
      return NextResponse.json(data);
    }
  } catch {
    // fallback
  }
  // Fallback prices
  return NextResponse.json({
    prices: { WLD: { usd: 6.0 }, USDC: { usd: 1.0 } },
  });
}
