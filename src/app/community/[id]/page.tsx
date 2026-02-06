"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthContext";
import { VoteButton } from "@/components/VoteButton";
import { categoryLabels, type PostCategory } from "@/lib/community";
import { getProduct } from "@/data/products";
import Link from "next/link";

type ReplyData = {
  id: string;
  content: string;
  authorLabel: string;
  createdAt: string;
};

type PostDetail = {
  id: string;
  category: PostCategory;
  productId?: string;
  title: string;
  content: string;
  authorLabel: string;
  createdAt: string;
  score: number;
  myVote: "up" | "down" | null;
  replies: ReplyData[];
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "방금";
  if (mins < 60) return `${mins}분 전`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}시간 전`;
  const days = Math.floor(hours / 24);
  return `${days}일 전`;
}

export default function PostDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { isLoggedIn, isVerified, nullifierHash, isReady } = useAuth();
  const [post, setPost] = useState<PostDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [replyContent, setReplyContent] = useState("");
  const [replying, setReplying] = useState(false);

  const authenticated = isLoggedIn && isVerified;
  const postId = params.id as string;

  const fetchPost = () => {
    const viewerParam = nullifierHash ? `?viewer=${encodeURIComponent(nullifierHash)}` : "";
    fetch(`/api/community/posts/${postId}${viewerParam}`)
      .then((r) => r.json())
      .then((data) => setPost(data.post || null))
      .catch(() => setPost(null))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!authenticated) return;
    fetchPost();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authenticated, postId, nullifierHash]);

  useEffect(() => {
    if (isReady && !authenticated) {
      router.push("/");
    }
  }, [isReady, authenticated, router]);

  if (!isReady || !authenticated || loading) {
    return (
      <div className="flex min-h-[80dvh] items-center justify-center">
        <span className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex min-h-[80dvh] flex-col items-center justify-center px-6 text-center">
        <span className="mb-4 text-5xl">🔍</span>
        <h2 className="mb-2 text-xl font-bold">게시글을 찾을 수 없습니다</h2>
        <button
          onClick={() => router.push("/community")}
          className="mt-4 rounded-2xl bg-primary px-6 py-3 font-semibold text-white"
        >
          커뮤니티로 돌아가기
        </button>
      </div>
    );
  }

  const handleVote = async (value: "up" | "down" | "none") => {
    const res = await fetch(`/api/community/posts/${postId}/vote`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ value, nullifierHash }),
    });
    const data = await res.json();
    if (data.status === "success") {
      setPost((prev) => prev ? { ...prev, score: data.score, myVote: data.myVote } : null);
    }
  };

  const handleReply = async () => {
    if (!replyContent.trim()) return;
    setReplying(true);
    try {
      const res = await fetch(`/api/community/posts/${postId}/replies`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: replyContent.trim(), nullifierHash }),
      });
      const data = await res.json();
      if (data.status === "success") {
        setReplyContent("");
        fetchPost();
      }
    } catch {
      // silently fail
    } finally {
      setReplying(false);
    }
  };

  const product = post.productId ? getProduct(post.productId) : null;

  return (
    <div className="px-6 pt-6 pb-32">
      <button
        onClick={() => router.back()}
        className="mb-4 text-sm text-muted hover:text-foreground transition-colors"
      >
        ← 뒤로
      </button>

      {/* Post */}
      <div className="mb-8">
        <div className="mb-2 flex items-center gap-2">
          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
            {categoryLabels[post.category]}
          </span>
          <span className="text-xs text-muted">{post.authorLabel}</span>
          <span className="text-xs text-muted">{timeAgo(post.createdAt)}</span>
        </div>

        <h1 className="mb-3 text-xl font-bold">{post.title}</h1>

        {product && (
          <Link
            href={`/products/${product.id}`}
            className="mb-3 flex items-center gap-2 rounded-xl bg-surface p-3 shadow-sm"
          >
            <span className="text-2xl">{product.image}</span>
            <div>
              <p className="text-sm font-semibold">{product.name}</p>
              <p className="text-xs text-muted">{product.price} WLD</p>
            </div>
          </Link>
        )}

        <p className="mb-4 whitespace-pre-wrap text-sm leading-relaxed">{post.content}</p>

        <VoteButton score={post.score} myVote={post.myVote} onVote={handleVote} />
      </div>

      {/* Replies */}
      <div className="mb-6">
        <h2 className="mb-3 text-sm font-semibold text-muted">
          답변 {post.replies.length}개
        </h2>
        {post.replies.length === 0 ? (
          <p className="py-4 text-center text-xs text-muted">아직 답변이 없습니다</p>
        ) : (
          <div className="space-y-3">
            {post.replies.map((reply) => (
              <div key={reply.id} className="rounded-xl bg-surface p-4 shadow-sm">
                <div className="mb-2 flex items-center gap-2">
                  <span className="text-xs font-semibold text-primary">{reply.authorLabel}</span>
                  <span className="text-xs text-muted">{timeAgo(reply.createdAt)}</span>
                </div>
                <p className="whitespace-pre-wrap text-sm">{reply.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Reply input - fixed above tab bar with safe area */}
      <div className="fixed left-0 right-0 border-t border-border bg-background/95 backdrop-blur-sm px-6 py-3" style={{ bottom: "calc(env(safe-area-inset-bottom, 0px) + 60px)" }}>
        <div className="mx-auto flex max-w-lg gap-2">
          <input
            type="text"
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder="익명으로 답변하기..."
            maxLength={500}
            className="flex-1 rounded-xl border border-border bg-surface px-4 py-2.5 text-sm placeholder:text-muted/50 focus:border-primary focus:outline-none"
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleReply()}
          />
          <button
            onClick={handleReply}
            disabled={replying || !replyContent.trim()}
            className="shrink-0 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
          >
            {replying ? "..." : "답변"}
          </button>
        </div>
      </div>
    </div>
  );
}
