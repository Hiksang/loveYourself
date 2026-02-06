import { NextRequest, NextResponse } from "next/server";
import { addReply } from "@/lib/community";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: postId } = await params;
    const body = await req.json();
    const { content, nullifierHash } = body;

    if (!content || !nullifierHash) {
      return NextResponse.json({ error: "필수 항목이 누락되었습니다" }, { status: 400 });
    }

    const reply = addReply({ postId, content, authorNullifier: nullifierHash });
    return NextResponse.json({ status: "success", reply: { id: reply.id } });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
