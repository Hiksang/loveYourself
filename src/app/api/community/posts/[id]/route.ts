import { NextRequest, NextResponse } from "next/server";
import { getPostDetail } from "@/lib/community";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const viewerNullifier = req.nextUrl.searchParams.get("viewer") || undefined;
  const detail = getPostDetail(id, viewerNullifier);

  if (!detail) {
    return NextResponse.json({ error: "게시글을 찾을 수 없습니다" }, { status: 404 });
  }

  return NextResponse.json({ post: detail });
}
