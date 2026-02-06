import { NextResponse } from "next/server";
import crypto from "crypto";
import { storePaymentReference } from "@/lib/auth";

export async function POST(req: Request) {
  const body = await req.json();
  const { amount } = body as { amount: number };

  const reference = crypto.randomUUID();
  storePaymentReference(reference, amount || 0);

  return NextResponse.json({ id: reference });
}
