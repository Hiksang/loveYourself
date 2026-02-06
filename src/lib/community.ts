// In-memory community store (MVP - would be DB in production)

export type PostCategory = "product" | "general" | "tips";

export const categoryLabels: Record<PostCategory, string> = {
  product: "상품 Q&A",
  general: "자유토론",
  tips: "팁/추천",
};

export type Post = {
  id: string;
  category: PostCategory;
  productId?: string;
  title: string;
  content: string;
  authorNullifier: string;
  createdAt: string;
};

export type Reply = {
  id: string;
  postId: string;
  content: string;
  authorNullifier: string;
  createdAt: string;
};

type VoteValue = "up" | "down";

// Storage
const posts: Post[] = [];
const replies: Reply[] = [];
const votes = new Map<string, Map<string, VoteValue>>(); // postId -> (nullifier -> vote)
const anonLabels = new Map<string, Map<string, number>>(); // postId -> (nullifier -> label number)

function getAnonLabel(postId: string, nullifier: string): string {
  if (!anonLabels.has(postId)) {
    anonLabels.set(postId, new Map());
  }
  const labelMap = anonLabels.get(postId)!;
  if (!labelMap.has(nullifier)) {
    labelMap.set(nullifier, labelMap.size + 1);
  }
  return `익명${labelMap.get(nullifier)}`;
}

function getVoteScore(postId: string): number {
  const voteMap = votes.get(postId);
  if (!voteMap) return 0;
  let score = 0;
  for (const v of voteMap.values()) {
    score += v === "up" ? 1 : -1;
  }
  return score;
}

function getMyVote(postId: string, nullifier: string): VoteValue | null {
  return votes.get(postId)?.get(nullifier) || null;
}

export function addPost(post: Omit<Post, "id" | "createdAt">): Post {
  const newPost: Post = {
    ...post,
    id: Math.random().toString(36).substring(2, 10),
    createdAt: new Date().toISOString(),
  };
  posts.push(newPost);
  // Register author as 익명1
  getAnonLabel(newPost.id, newPost.authorNullifier);
  return newPost;
}

export function getPosts(category?: PostCategory, productId?: string) {
  let filtered = [...posts];
  if (category) filtered = filtered.filter((p) => p.category === category);
  if (productId) filtered = filtered.filter((p) => p.productId === productId);

  return filtered
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .map((p) => ({
      id: p.id,
      category: p.category,
      productId: p.productId,
      title: p.title,
      content: p.content.length > 100 ? p.content.slice(0, 100) + "..." : p.content,
      authorLabel: getAnonLabel(p.id, p.authorNullifier),
      createdAt: p.createdAt,
      score: getVoteScore(p.id),
      replyCount: replies.filter((r) => r.postId === p.id).length,
    }));
}

export function getPostDetail(postId: string, viewerNullifier?: string) {
  const post = posts.find((p) => p.id === postId);
  if (!post) return null;

  const postReplies = replies
    .filter((r) => r.postId === postId)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    .map((r) => ({
      id: r.id,
      content: r.content,
      authorLabel: getAnonLabel(postId, r.authorNullifier),
      createdAt: r.createdAt,
    }));

  return {
    id: post.id,
    category: post.category,
    productId: post.productId,
    title: post.title,
    content: post.content,
    authorLabel: getAnonLabel(post.id, post.authorNullifier),
    createdAt: post.createdAt,
    score: getVoteScore(post.id),
    myVote: viewerNullifier ? getMyVote(post.id, viewerNullifier) : null,
    replies: postReplies,
  };
}

export function addReply(reply: Omit<Reply, "id" | "createdAt">): Reply {
  const post = posts.find((p) => p.id === reply.postId);
  if (!post) throw new Error("게시글을 찾을 수 없습니다");

  const newReply: Reply = {
    ...reply,
    id: Math.random().toString(36).substring(2, 10),
    createdAt: new Date().toISOString(),
  };
  replies.push(newReply);
  // Register reply author label
  getAnonLabel(reply.postId, reply.authorNullifier);
  return newReply;
}

export function vote(postId: string, nullifier: string, value: VoteValue | "none") {
  if (!posts.find((p) => p.id === postId)) throw new Error("게시글을 찾을 수 없습니다");

  if (!votes.has(postId)) {
    votes.set(postId, new Map());
  }
  const voteMap = votes.get(postId)!;

  if (value === "none") {
    voteMap.delete(nullifier);
  } else {
    voteMap.set(nullifier, value);
  }

  return { score: getVoteScore(postId), myVote: getMyVote(postId, nullifier) };
}
