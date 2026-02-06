import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import crypto from "crypto";

export async function GET() {
  const nonce = crypto.randomUUID();
  const cookieStore = await cookies();
  cookieStore.set("siwe-nonce", nonce, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 60 * 10, // 10 minutes
  });
  return NextResponse.json({ nonce });
}
