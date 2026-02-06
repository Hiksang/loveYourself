"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthContext";
import { PostCard } from "@/components/PostCard";
import type { PostCategory } from "@/lib/community";

type PostSummary = {
  id: string;
  category: PostCategory;
  title: string;
  content: string;
  authorLabel: string;
  createdAt: string;
  score: number;
  replyCount: number;
};

const categoryTabs: { key: PostCategory | "all"; label: string }[] = [
  { key: "all", label: "전체" },
  { key: "product", label: "상품 Q&A" },
  { key: "general", label: "자유토론" },
  { key: "tips", label: "팁/추천" },
];

export default function CommunityPage() {
  const { isLoggedIn, isVerified } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<PostCategory | "all">("all");
  const [posts, setPosts] = useState<PostSummary[]>([]);
  const [loading, setLoading] = useState(true);

  const authenticated = isLoggedIn && isVerified;

  useEffect(() => {
    if (!authenticated) return;
    setLoading(true);
    const params = activeTab === "all" ? "" : `?category=${activeTab}`;
    fetch(`/api/community/posts${params}`)
      .then((r) => r.json())
      .then((data) => setPosts(data.posts || []))
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, [authenticated, activeTab]);

  if (!authenticated) {
    return (
      <div className="flex min-h-[80dvh] flex-col items-center justify-center px-6 text-center">
        <span className="mb-4 text-5xl">💬</span>
        <h2 className="mb-2 text-xl font-bold">커뮤니티</h2>
        <p className="mb-6 text-sm text-muted">성인 인증 후 이용할 수 있습니다</p>
        <button
          onClick={() => router.push("/")}
          className="rounded-2xl bg-primary px-6 py-3 font-semibold text-white"
        >
          홈으로 이동
        </button>
      </div>
    );
  }

  return (
    <div className="px-6 pt-6 pb-8">
      <button
        onClick={() => router.back()}
        className="mb-4 text-sm text-muted hover:text-foreground transition-colors"
      >
        ← 뒤로
      </button>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">커뮤니티</h1>
        <button
          onClick={() => router.push("/community/new")}
          className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-primary-dark active:scale-[0.98]"
        >
          새 글 쓰기
        </button>
      </div>

      {/* Category tabs */}
      <div className="mb-6 flex gap-2 overflow-x-auto">
        {categoryTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? "bg-primary text-white"
                : "bg-surface text-muted"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Posts list */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <span className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      ) : posts.length === 0 ? (
        <div className="py-12 text-center">
          <span className="mb-2 block text-4xl">📝</span>
          <p className="text-sm text-muted">아직 게시글이 없습니다</p>
          <p className="text-xs text-muted">첫 번째 글을 작성해보세요!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <PostCard key={post.id} {...post} />
          ))}
        </div>
      )}
    </div>
  );
}
