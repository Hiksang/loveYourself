import {
  verifyCloudProof,
  type IVerifyResponse,
  type ISuccessResult,
} from "@worldcoin/minikit-js";
import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { setVerified, setSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { payload, action } = (await req.json()) as {
    payload: ISuccessResult;
    action: string;
  };

  const app_id = process.env.APP_ID as `app_${string}`;

  const verifyRes = (await verifyCloudProof(
    payload,
    app_id,
    action
  )) as IVerifyResponse;

  if (verifyRes.success) {
    const cookieStore = await cookies();
    const address = cookieStore.get("wallet-address")?.value;

    if (address) {
      setVerified(address);
      setSession(address, true);
    }

    cookieStore.set("age-verified", "true", {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    return NextResponse.json({ status: "success" });
  }

  return NextResponse.json(
    { status: "error", message: "Verification failed" },
    { status: 400 }
  );
}
