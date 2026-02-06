import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { storePaymentReference } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { items, totalWLD, totalUSDC, currency, message, nullifierHash } = body;

    if (!items || !items.length || !nullifierHash || !currency) {
      return NextResponse.json({ error: "필수 항목이 누락되었습니다" }, { status: 400 });
    }

    const reference = crypto.randomUUID();
    const amount = currency === "WLD" ? totalWLD : totalUSDC;
    storePaymentReference(reference, amount);

    return NextResponse.json({
      status: "success",
      reference,
      // Store pending gift data in reference for confirm step
      giftData: { items, totalWLD, totalUSDC, currency, message, nullifierHash },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
