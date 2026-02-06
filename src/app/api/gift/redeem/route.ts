import { NextRequest, NextResponse } from "next/server";
import { redeemGift } from "@/lib/gifts";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { code, pickupLocationId } = body;

    if (!code || !pickupLocationId) {
      return NextResponse.json({ error: "필수 항목이 누락되었습니다" }, { status: 400 });
    }

    const gift = redeemGift(code, pickupLocationId);
    if (!gift) {
      return NextResponse.json({ error: "수령할 수 없는 선물입니다" }, { status: 400 });
    }

    return NextResponse.json({
      status: "success",
      pickupCode: gift.pickupCode,
      pickupLocationId: gift.pickupLocationId,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
