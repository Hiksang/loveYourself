// In-memory review store (MVP - would be on-chain in production)
export type Review = {
  id: string;
  productId: string;
  rating: number; // 1-5
  content: string;
  nullifierHash: string; // ZKP proof that reviewer purchased (anonymized)
  createdAt: string;
};

const reviews: Review[] = [];

export function addReview(review: Omit<Review, "id" | "createdAt">): Review {
  // Check duplicate by nullifier + product
  const existing = reviews.find(
    (r) => r.nullifierHash === review.nullifierHash && r.productId === review.productId
  );
  if (existing) {
    throw new Error("이미 이 상품에 리뷰를 작성했습니다");
  }

  const newReview: Review = {
    ...review,
    id: Math.random().toString(36).substring(2, 10),
    createdAt: new Date().toISOString(),
  };
  reviews.push(newReview);
  return newReview;
}

export function getReviewsByProduct(productId: string): Review[] {
  return reviews
    .filter((r) => r.productId === productId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function getAverageRating(productId: string): { avg: number; count: number } {
  const productReviews = reviews.filter((r) => r.productId === productId);
  if (productReviews.length === 0) return { avg: 0, count: 0 };
  const sum = productReviews.reduce((acc, r) => acc + r.rating, 0);
  return { avg: sum / productReviews.length, count: productReviews.length };
}
