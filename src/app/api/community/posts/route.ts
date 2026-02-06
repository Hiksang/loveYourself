import { NextRequest, NextResponse } from "next/server";
import { addPost, getPosts, type PostCategory } from "@/lib/community";

export async function GET(req: NextRequest) {
  const category = req.nextUrl.searchParams.get("category") as PostCategory | null;
  const productId = req.nextUrl.searchParams.get("productId") || undefined;
  const postList = getPosts(category || undefined, productId);
  return NextResponse.json({ posts: postList });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { category, productId, title, content, nullifierHash } = body;

    if (!category || !title || !content || !nullifierHash) {
      return NextResponse.json({ error: "필수 항목이 누락되었습니다" }, { status: 400 });
    }

    const post = addPost({ category, productId, title, content, authorNullifier: nullifierHash });
    return NextResponse.json({ status: "success", post: { id: post.id } });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
