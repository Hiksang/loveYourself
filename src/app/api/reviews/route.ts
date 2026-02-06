import { NextRequest, NextResponse } from "next/server";
import { addReview, getReviewsByProduct } from "@/lib/reviews";

export async function GET(req: NextRequest) {
  const productId = req.nextUrl.searchParams.get("productId");
  if (!productId) {
    return NextResponse.json({ error: "productId required" }, { status: 400 });
  }
  const reviews = getReviewsByProduct(productId);
  return NextResponse.json({ reviews });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { productId, rating, content, nullifierHash } = body;

    if (!productId || !rating || !content || !nullifierHash) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const review = addReview({ productId, rating, content, nullifierHash });
    return NextResponse.json({ status: "success", review });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
