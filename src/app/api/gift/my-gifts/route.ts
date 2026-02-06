import { NextRequest, NextResponse } from "next/server";
import { getMyGifts } from "@/lib/gifts";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { nullifierHash } = body;

    if (!nullifierHash) {
      return NextResponse.json({ error: "인증이 필요합니다" }, { status: 400 });
    }

    const gifts = getMyGifts(nullifierHash).map((g) => ({
      giftCode: g.giftCode,
      items: g.items,
      totalWLD: g.totalWLD,
      totalUSDC: g.totalUSDC,
      currency: g.currency,
      status: g.status,
      message: g.message,
      createdAt: g.createdAt,
      expiresAt: g.expiresAt,
    }));

    return NextResponse.json({ gifts });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
