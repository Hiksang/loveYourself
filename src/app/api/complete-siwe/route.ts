import {
  type MiniAppWalletAuthSuccessPayload,
  verifySiweMessage,
} from "@worldcoin/minikit-js";
import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { setSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { payload, nonce } = (await req.json()) as {
    payload: MiniAppWalletAuthSuccessPayload;
    nonce: string;
  };

  const cookieStore = await cookies();
  const storedNonce = cookieStore.get("siwe-nonce")?.value;

  if (nonce !== storedNonce) {
    return NextResponse.json(
      { status: "error", message: "Invalid nonce" },
      { status: 400 }
    );
  }

  const validMessage = await verifySiweMessage(payload, nonce);

  if (!validMessage.isValid) {
    return NextResponse.json(
      { status: "error", message: "Invalid signature" },
      { status: 400 }
    );
  }

  // Create session
  setSession(payload.address, false);
  cookieStore.set("wallet-address", payload.address, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  return NextResponse.json({ status: "success", address: payload.address });
}
