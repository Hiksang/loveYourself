import { NextRequest, NextResponse } from "next/server";
import { createGift } from "@/lib/gifts";
import { getPaymentReference, updatePaymentStatus } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { paymentPayload, giftData } = body;

    if (!giftData || !giftData.nullifierHash) {
      return NextResponse.json({ error: "필수 항목이 누락되었습니다" }, { status: 400 });
    }

    const reference = paymentPayload?.reference || giftData.reference;

    // For dev mode (no real payment), just check reference exists
    const ref = getPaymentReference(reference);
    if (!ref) {
      return NextResponse.json({ error: "결제 정보를 찾을 수 없습니다" }, { status: 400 });
    }

    updatePaymentStatus(reference, "completed");

    const gift = createGift({
      senderNullifier: giftData.nullifierHash,
      items: giftData.items,
      totalWLD: giftData.totalWLD,
      totalUSDC: giftData.totalUSDC,
      currency: giftData.currency,
      paymentReference: reference,
      message: giftData.message,
    });

    return NextResponse.json({
      status: "success",
      giftCode: gift.giftCode,
      expiresAt: gift.expiresAt,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
