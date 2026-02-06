"use client";

import Link from "next/link";
import { categoryLabels, type PostCategory } from "@/lib/community";

type Props = {
  id: string;
  category: PostCategory;
  title: string;
  content: string;
  authorLabel: string;
  createdAt: string;
  score: number;
  replyCount: number;
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

export function PostCard({ id, category, title, content, authorLabel, createdAt, score, replyCount }: Props) {
  return (
    <Link href={`/community/${id}`} className="block rounded-2xl bg-surface p-4 shadow-sm transition-all hover:shadow-md">
      <div className="mb-2 flex items-center gap-2">
        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
          {categoryLabels[category]}
        </span>
        <span className="text-xs text-muted">{authorLabel}</span>
        <span className="text-xs text-muted">{timeAgo(createdAt)}</span>
      </div>
      <h3 className="mb-1 text-sm font-semibold line-clamp-1">{title}</h3>
      <p className="mb-3 text-xs text-muted line-clamp-2">{content}</p>
      <div className="flex items-center gap-4 text-xs text-muted">
        <span className={score > 0 ? "text-primary font-medium" : ""}>+{score} 점</span>
        <span>{replyCount}개 답변</span>
      </div>
    </Link>
  );
}
