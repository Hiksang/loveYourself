import { type NextRequest, NextResponse } from "next/server";
import { getPaymentReference, updatePaymentStatus } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const payload = await req.json();

  // Verify transaction with Developer Portal API
  const response = await fetch(
    `https://developer.worldcoin.org/api/v2/minikit/transaction/${payload.transaction_id}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.DEV_PORTAL_API_KEY}`,
      },
    }
  );

  if (!response.ok) {
    return NextResponse.json(
      { status: "error", message: "Failed to verify transaction" },
      { status: 400 }
    );
  }

  const transaction = await response.json();

  const ref = getPaymentReference(payload.reference);

  if (ref && transaction.reference === payload.reference && transaction.status !== "failed") {
    updatePaymentStatus(payload.reference, "completed");

    // Generate pickup code
    const pickupCode = Math.random().toString(36).substring(2, 8).toUpperCase();

    return NextResponse.json({
      status: "success",
      pickupCode,
      transactionId: payload.transaction_id,
    });
  }

  return NextResponse.json(
    { status: "error", message: "Payment verification failed" },
    { status: 400 }
  );
}
