"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/AuthContext";

type Review = {
  id: string;
  rating: number;
  content: string;
  createdAt: string;
};

function StarRating({ rating, onChange }: { rating: number; onChange?: (r: number) => void }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => onChange?.(star)}
          disabled={!onChange}
          className={`text-lg transition-colors ${
            star <= rating ? "text-yellow-400" : "text-gray-200"
          } ${onChange ? "cursor-pointer hover:text-yellow-300" : ""}`}
        >
          ★
        </button>
      ))}
    </div>
  );
}

export function ReviewSection({ productId }: { productId: string }) {
  const { isVerified, walletAddress } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/reviews?productId=${productId}`)
      .then((r) => r.json())
      .then((data) => setReviews(data.reviews || []))
      .catch(() => {});
  }, [productId]);

  const handleSubmit = async () => {
    if (!content.trim()) return;
    setSubmitting(true);
    setError(null);

    try {
      const nullifierHash = walletAddress || "anonymous_" + Math.random().toString(36).slice(2);
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, rating, content, nullifierHash }),
      });
      const data = await res.json();
      if (data.status === "success") {
        setReviews((prev) => [data.review, ...prev]);
        setContent("");
        setShowForm(false);
      } else {
        setError(data.error || "리뷰 작성에 실패했습니다");
      }
    } catch {
      setError("오류가 발생했습니다");
    } finally {
      setSubmitting(false);
    }
  };

  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : "0";

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold">리뷰</h3>
          <div className="flex items-center gap-2 mt-1">
            <StarRating rating={Math.round(Number(avgRating))} />
            <span className="text-sm text-muted">{avgRating} ({reviews.length}개)</span>
          </div>
        </div>
        {isVerified && !showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="rounded-xl bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary"
          >
            리뷰 쓰기
          </button>
        )}
      </div>

      {/* Review form */}
      {showForm && (
        <div className="mb-4 rounded-xl bg-surface p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-medium">별점</span>
            <StarRating rating={rating} onChange={setRating} />
          </div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="솔직한 리뷰를 남겨주세요 (익명으로 게시됩니다)"
            className="mb-3 w-full rounded-lg border border-border bg-background p-3 text-sm placeholder:text-muted/50 focus:border-primary focus:outline-none"
            rows={3}
          />
          {error && <p className="mb-2 text-xs text-red-500">{error}</p>}
          <div className="flex gap-2">
            <button
              onClick={handleSubmit}
              disabled={submitting || !content.trim()}
              className="flex-1 rounded-lg bg-primary py-2 text-sm font-semibold text-white disabled:opacity-50"
            >
              {submitting ? "게시 중..." : "익명으로 게시"}
            </button>
            <button
              onClick={() => { setShowForm(false); setError(null); }}
              className="rounded-lg bg-gray-100 px-4 py-2 text-sm text-muted"
            >
              취소
            </button>
          </div>
          <p className="mt-2 text-xs text-muted">🔒 ZKP로 구매 여부만 증명, 작성자 정보는 공개되지 않습니다</p>
        </div>
      )}

      {/* Review list */}
      {reviews.length === 0 && !showForm && (
        <p className="py-4 text-center text-sm text-muted">아직 리뷰가 없습니다</p>
      )}
      <div className="space-y-3">
        {reviews.map((review) => (
          <div key={review.id} className="rounded-xl bg-surface p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <StarRating rating={review.rating} />
              <span className="text-xs text-muted">
                {new Date(review.createdAt).toLocaleDateString("ko-KR")}
              </span>
            </div>
            <p className="text-sm leading-relaxed">{review.content}</p>
            <p className="mt-2 text-xs text-muted">🔒 익명 인증 리뷰</p>
          </div>
        ))}
      </div>
    </div>
  );
}
