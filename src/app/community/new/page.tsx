"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthContext";
import { products } from "@/data/products";
import type { PostCategory } from "@/lib/community";

export default function NewPostPage() {
  const { isLoggedIn, isVerified, nullifierHash } = useAuth();
  const router = useRouter();
  const [category, setCategory] = useState<PostCategory>("general");
  const [productId, setProductId] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const authenticated = isLoggedIn && isVerified;

  if (!authenticated) {
    router.push("/");
    return null;
  }

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      setError("제목과 내용을 입력해주세요");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/community/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category,
          productId: category === "product" ? productId : undefined,
          title: title.trim(),
          content: content.trim(),
          nullifierHash,
        }),
      });

      const data = await res.json();
      if (data.status === "success") {
        router.push("/community");
      } else {
        setError(data.error || "게시글 작성에 실패했습니다");
      }
    } catch {
      setError("오류가 발생했습니다");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-6 pt-6 pb-8">
      <button
        onClick={() => router.back()}
        className="mb-4 text-sm text-muted hover:text-foreground transition-colors"
      >
        ← 뒤로
      </button>

      <h1 className="mb-4 text-2xl font-bold">새 글 쓰기</h1>

      {/* Category selection */}
      <div className="mb-4">
        <label className="mb-2 block text-sm font-semibold">카테고리</label>
        <div className="flex gap-2">
          {(["general", "product", "tips"] as PostCategory[]).map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
                category === cat
                  ? "bg-primary text-white"
                  : "bg-surface text-muted"
              }`}
            >
              {cat === "product" ? "상품 Q&A" : cat === "general" ? "자유토론" : "팁/추천"}
            </button>
          ))}
        </div>
      </div>

      {/* Product selection for product Q&A */}
      {category === "product" && (
        <div className="mb-4">
          <label className="mb-2 block text-sm font-semibold">상품 선택</label>
          <select
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm focus:border-primary focus:outline-none"
          >
            <option value="">상품을 선택하세요</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.image} {p.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Title */}
      <div className="mb-4">
        <label className="mb-2 block text-sm font-semibold">제목</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="제목을 입력하세요"
          maxLength={100}
          className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm placeholder:text-muted/50 focus:border-primary focus:outline-none"
        />
      </div>

      {/* Content */}
      <div className="mb-6">
        <label className="mb-2 block text-sm font-semibold">내용</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="내용을 입력하세요"
          rows={6}
          maxLength={2000}
          className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm placeholder:text-muted/50 focus:border-primary focus:outline-none resize-none"
        />
        <p className="mt-1 text-right text-xs text-muted">{content.length}/2000</p>
      </div>

      {error && (
        <p className="mb-4 text-center text-sm text-red-500">{error}</p>
      )}

      {/* Privacy notice */}
      <div className="mb-4 rounded-xl bg-primary/5 p-3">
        <p className="text-xs text-primary font-medium">
          익명으로 게시됩니다. 개인정보가 노출되지 않습니다.
        </p>
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading || !title.trim() || !content.trim()}
        className="w-full rounded-2xl bg-primary py-4 text-lg font-semibold text-white transition-all hover:bg-primary-dark active:scale-[0.98] disabled:opacity-50"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
            게시 중...
          </span>
        ) : (
          "익명으로 게시"
        )}
      </button>
    </div>
  );
}
