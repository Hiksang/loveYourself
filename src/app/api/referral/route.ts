import { NextRequest, NextResponse } from "next/server";
import { generateReferralCode, getReferralStats } from "@/lib/referral";

export async function POST(req: NextRequest) {
  const { address } = await req.json();
  if (!address) {
    return NextResponse.json({ error: "Address required" }, { status: 400 });
  }
  const code = generateReferralCode(address);
  return NextResponse.json({ code });
}

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  if (!code) {
    return NextResponse.json({ error: "Code required" }, { status: 400 });
  }
  const stats = getReferralStats(code);
  if (!stats) {
    return NextResponse.json({ error: "Invalid code" }, { status: 404 });
  }
  return NextResponse.json({ code, uses: stats.uses });
}
