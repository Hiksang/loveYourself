import { NextRequest, NextResponse } from "next/server";
import { getGiftByCode } from "@/lib/gifts";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;
  const gift = getGiftByCode(code);

  if (!gift) {
    return NextResponse.json({ error: "선물을 찾을 수 없습니다" }, { status: 404 });
  }

  // Don't expose sender nullifier
  return NextResponse.json({
    gift: {
      giftCode: gift.giftCode,
      items: gift.items,
      totalWLD: gift.totalWLD,
      totalUSDC: gift.totalUSDC,
      currency: gift.currency,
      status: gift.status,
      message: gift.message,
      createdAt: gift.createdAt,
      expiresAt: gift.expiresAt,
    },
  });
}
