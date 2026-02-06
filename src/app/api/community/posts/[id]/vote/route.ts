import { NextRequest, NextResponse } from "next/server";
import { vote } from "@/lib/community";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: postId } = await params;
    const body = await req.json();
    const { value, nullifierHash } = body;

    if (!nullifierHash || !["up", "down", "none"].includes(value)) {
      return NextResponse.json({ error: "잘못된 요청입니다" }, { status: 400 });
    }

    const result = vote(postId, nullifierHash, value);
    return NextResponse.json({ status: "success", ...result });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
