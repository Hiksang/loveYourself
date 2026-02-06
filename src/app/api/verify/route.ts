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

  // Validate required fields
  if (!payload?.proof || !payload?.merkle_root || !payload?.nullifier_hash) {
    return NextResponse.json(
      { status: "error", message: "Missing required proof fields" },
      { status: 400 }
    );
  }

  if (!action) {
    return NextResponse.json(
      { status: "error", message: "Missing action" },
      { status: 400 }
    );
  }

  const app_id = process.env.APP_ID as `app_${string}`;

  if (!app_id || app_id === "app_staging_xxxxx") {
    return NextResponse.json(
      { status: "error", message: "APP_ID not configured" },
      { status: 500 }
    );
  }

  try {
    console.log("[verify] Calling verifyCloudProof with:", {
      app_id,
      action,
      nullifier_hash: payload.nullifier_hash,
      verification_level: payload.verification_level,
    });

    const verifyRes = (await verifyCloudProof(
      payload,
      app_id,
      action
    )) as IVerifyResponse;

    console.log("[verify] verifyCloudProof result:", JSON.stringify(verifyRes));

    if (verifyRes.success) {
      const nullifierHash = payload.nullifier_hash;

      // Store verification state using nullifier_hash as identifier
      setVerified(nullifierHash);
      setSession(nullifierHash, true);

      // Set verification cookie
      const cookieStore = await cookies();
      cookieStore.set("age-verified", "true", {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 30, // 30 days
      });
      cookieStore.set("nullifier-hash", nullifierHash, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 30,
      });

      return NextResponse.json({
        status: "success",
        nullifierHash,
      });
    }

    // Check if already verified (max_verifications_reached = user already proved identity)
    const errorInfo = verifyRes as unknown as Record<string, unknown>;
    if (errorInfo.code === "max_verifications_reached") {
      const nullifierHash = payload.nullifier_hash;
      setVerified(nullifierHash);
      setSession(nullifierHash, true);

      const cookieStore = await cookies();
      cookieStore.set("age-verified", "true", {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 30,
      });
      cookieStore.set("nullifier-hash", nullifierHash, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 30,
      });

      return NextResponse.json({
        status: "success",
        nullifierHash,
      });
    }

    // Verification failed — return details for debugging
    console.error("World ID verification failed:", errorInfo);
    return NextResponse.json(
      {
        status: "error",
        message: "Verification failed",
        code: errorInfo.code || "unknown",
        detail: errorInfo.detail || null,
      },
      { status: 400 }
    );
  } catch (err) {
    console.error("verifyCloudProof error:", err);
    return NextResponse.json(
      { status: "error", message: "Internal verification error" },
      { status: 500 }
    );
  }
}
