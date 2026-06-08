import { prisma } from "../../config/db.js";
import {
  getPagination,
  paginatedResponse,
} from "../../utils/pagination.utils.js";

// ─── Types ────────────────────────────────────────────────────────────────────

interface AuthorShape {
  id: string;
  name: string;
  avatar: string | null;
}

interface CommentShape {
  id: string;
  content: string;
  author: AuthorShape;
  isOwn: boolean;
  createdAt: string;
}

interface PostListItem {
  id: string;
  title: string;
  content: string;
  isPinned: boolean;
  author: AuthorShape;
  isOwn: boolean;
  commentCount: number;
  likeCount: number;
  isLiked: boolean;
  isBookmarked: boolean;
  createdAt: string;
}

interface PostDetail extends PostListItem {
  comments: CommentShape[];
}

// ─── Internal helpers ─────────────────────────────────────────────────────────

/**
 * Builds the Prisma `include` block reused across every post query.
 * Passing `currentUserId` lets us check like/bookmark status in one query.
 */
function postInclude(currentUserId: string) {
  return {
    user: { select: { id: true, name: true, avatar: true } },
    _count: { select: { comments: true, likes: true } },
    likes: {
      where: { userId: currentUserId },
      select: { userId: true },
    },
    bookmarks: {
      where: { userId: currentUserId },
      select: { userId: true },
    },
  } as const;
}

/** Shapes a raw Prisma post row into the public `PostListItem` contract. */
function formatPost(p: any, currentUserId: string): PostListItem {
  return {
    id: p.id,
    title: p.title,
    content: p.content,
    isPinned: p.isPinned ?? false,
    author: {
      id: p.user.id,
      name: p.user.name,
      avatar: p.user.avatar,
    },
    isOwn: p.user.id === currentUserId,
    commentCount: p._count?.comments ?? p.comments?.length ?? 0,
    likeCount: p._count?.likes ?? p.likes?.length ?? 0,
    isLiked: Array.isArray(p.likes)
      ? p.likes.some((l: any) => l.userId === currentUserId)
      : false,
    isBookmarked: Array.isArray(p.bookmarks)
      ? p.bookmarks.some((b: any) => b.userId === currentUserId)
      : false,
    createdAt:
      p.createdAt instanceof Date
        ? p.createdAt.toISOString()
        : new Date().toISOString(),
  };
}

/** Shapes a raw Prisma comment row into the public `CommentShape` contract. */
function formatComment(c: any, currentUserId: string): CommentShape {
  return {
    id: c.id,
    content: c.content,
    author: {
      id: c.user.id,
      name: c.user.name,
      avatar: c.user.avatar,
    },
    isOwn: c.user.id === currentUserId,
    createdAt:
      c.createdAt instanceof Date
        ? c.createdAt.toISOString()
        : new Date().toISOString(),
  };
}

// ─── Posts — list / search ────────────────────────────────────────────────────

/**
 * GET /community/posts
 * Returns paginated posts ordered: pinned first, then newest.
 */
export async function getPostsService(req: any) {
  const { page, limit, skip } = getPagination(req.query);
  const currentUserId: string = req.user!.userId;

  const [posts, total] = await Promise.all([
    prisma.communityPost.findMany({
      include: postInclude(currentUserId),
      orderBy: [{ isPinned: "desc" }, { createdAt: "desc" }],
      skip,
      take: limit,
    }),
    prisma.communityPost.count(),
  ]);

  return paginatedResponse(
    posts.map((p) => formatPost(p, currentUserId)),
    total,
    page,
    limit
  );
}

/**
 * GET /community/posts/search?q=...
 * Full-text search across title and content.
 */
export async function searchPostsService(req: any) {
  const q = typeof req.query.q === "string" ? req.query.q.trim() : "";
  if (!q) return paginatedResponse([], 0, 1, 10);

  const { page, limit, skip } = getPagination(req.query);
  const currentUserId: string = req.user!.userId;

  const where = {
    OR: [
      { title: { contains: q, mode: "insensitive" as const } },
      { content: { contains: q, mode: "insensitive" as const } },
    ],
  };

  const [posts, total] = await Promise.all([
    prisma.communityPost.findMany({
      where,
      include: postInclude(currentUserId),
      orderBy: [{ isPinned: "desc" }, { createdAt: "desc" }],
      skip,
      take: limit,
    }),
    prisma.communityPost.count({ where }),
  ]);

  return paginatedResponse(
    posts.map((p) => formatPost(p, currentUserId)),
    total,
    page,
    limit
  );
}

// ─── Posts — single ───────────────────────────────────────────────────────────

/**
 * GET /community/posts/:postId
 * Returns post + all comments in chronological order.
 */
export async function getPostService(
  postId: string,
  currentUserId: string
): Promise<PostDetail> {
  const post = await prisma.communityPost.findUnique({
    where: { id: postId },
    include: {
      ...postInclude(currentUserId),
      comments: {
        include: {
          user: { select: { id: true, name: true, avatar: true } },
        },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!post) throw new Error("Post not found");

  return {
    ...formatPost(post, currentUserId),
    comments: post.comments.map((c) => formatComment(c, currentUserId)),
  };
}

// ─── Posts — create / update / delete ────────────────────────────────────────

/**
 * POST /community/posts
 */
export async function createPostService(
  userId: string,
  body: any
): Promise<PostListItem> {
  const title = typeof body.title === "string" ? body.title.trim() : "";
  const content = typeof body.content === "string" ? body.content.trim() : "";

  if (!title) throw new Error("Title is required");
  if (!content) throw new Error("Content is required");
  if (title.length > 200)
    throw new Error("Title must be 200 characters or fewer");
  if (content.length > 10_000)
    throw new Error("Content must be 10,000 characters or fewer");

  const post = await prisma.communityPost.create({
    data: { userId, title, content },
    include: postInclude(userId),
  });

  return formatPost(post, userId);
}

/**
 * PATCH /community/posts/:postId
 * Only the owner may edit their own post.
 */
export async function updatePostService(
  postId: string,
  userId: string,
  body: any
): Promise<PostListItem> {
  const existing = await prisma.communityPost.findFirst({
    where: { id: postId, userId },
  });
  if (!existing) throw new Error("Post not found or not authorised");

  const title =
    typeof body.title === "string" ? body.title.trim() : existing.title;
  const content =
    typeof body.content === "string" ? body.content.trim() : existing.content;

  if (!title) throw new Error("Title is required");
  if (!content) throw new Error("Content is required");

  const post = await prisma.communityPost.update({
    where: { id: postId },
    data: { title, content },
    include: postInclude(userId),
  });

  return formatPost(post, userId);
}

/**
 * DELETE /community/posts/:postId
 * Owner-only. Cascade via Prisma schema removes comments, likes, bookmarks.
 */
export async function deletePostService(
  postId: string,
  userId: string
): Promise<void> {
  const result = await prisma.communityPost.deleteMany({
    where: { id: postId, userId },
  });
  if (result.count === 0) throw new Error("Post not found or not authorised");
}

// ─── Posts — pin (admin only) ─────────────────────────────────────────────────

/**
 * PATCH /community/posts/:postId/pin  { pin: true | false }
 */
export async function pinPostService(postId: string, pin: boolean) {
  const post = await prisma.communityPost.findUnique({ where: { id: postId } });
  if (!post) throw new Error("Post not found");

  return prisma.communityPost.update({
    where: { id: postId },
    data: { isPinned: pin },
  });
}

// ─── Posts — likes ────────────────────────────────────────────────────────────

/**
 * POST /community/posts/:postId/like
 * Idempotent — liking twice is a no-op.
 */
export async function likePostService(postId: string, userId: string) {
  const post = await prisma.communityPost.findUnique({ where: { id: postId } });
  if (!post) throw new Error("Post not found");

  await prisma.postLike.upsert({
    where: { postId_userId: { postId, userId } },
    create: { postId, userId },
    update: {},
  });

  const likeCount = await prisma.postLike.count({ where: { postId } });
  return { liked: true, likeCount };
}

/**
 * DELETE /community/posts/:postId/like
 */
export async function unlikePostService(postId: string, userId: string) {
  await prisma.postLike.deleteMany({ where: { postId, userId } });
  const likeCount = await prisma.postLike.count({ where: { postId } });
  return { liked: false, likeCount };
}

// ─── Posts — bookmarks ────────────────────────────────────────────────────────

/**
 * POST /community/posts/:postId/bookmark
 */
export async function bookmarkPostService(postId: string, userId: string) {
  const post = await prisma.communityPost.findUnique({ where: { id: postId } });
  if (!post) throw new Error("Post not found");

  await prisma.postBookmark.upsert({
    where: { postId_userId: { postId, userId } },
    create: { postId, userId },
    update: {},
  });

  return { bookmarked: true };
}

/**
 * DELETE /community/posts/:postId/bookmark
 */
export async function unbookmarkPostService(postId: string, userId: string) {
  await prisma.postBookmark.deleteMany({ where: { postId, userId } });
  return { bookmarked: false };
}

// ─── Posts — reports ──────────────────────────────────────────────────────────

/**
 * POST /community/posts/:postId/report  { reason: string }
 * One report per user per post.
 */
export async function reportPostService(
  postId: string,
  userId: string,
  reason: string
) {
  if (!reason?.trim()) throw new Error("Reason is required");

  const post = await prisma.communityPost.findUnique({ where: { id: postId } });
  if (!post) throw new Error("Post not found");

  const existing = await prisma.postReport.findUnique({
    where: { postId_userId: { postId, userId } },
  });
  if (existing) throw new Error("You have already reported this post");

  await prisma.postReport.create({
    data: { postId, userId, reason: reason.trim() },
  });

  return { reported: true };
}

// ─── User-scoped queries ──────────────────────────────────────────────────────

/**
 * GET /community/me/posts
 */
export async function getMyPostsService(req: any) {
  const { page, limit, skip } = getPagination(req.query);
  const currentUserId: string = req.user!.userId;

  const [posts, total] = await Promise.all([
    prisma.communityPost.findMany({
      where: { userId: currentUserId },
      include: postInclude(currentUserId),
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.communityPost.count({ where: { userId: currentUserId } }),
  ]);

  return paginatedResponse(
    posts.map((p) => formatPost(p, currentUserId)),
    total,
    page,
    limit
  );
}

/**
 * GET /community/me/bookmarks
 */
export async function getMyBookmarksService(req: any) {
  const { page, limit, skip } = getPagination(req.query);
  const currentUserId: string = req.user!.userId;

  const [bookmarks, total] = await Promise.all([
    prisma.postBookmark.findMany({
      where: { userId: currentUserId },
      include: {
        post: { include: postInclude(currentUserId) },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.postBookmark.count({ where: { userId: currentUserId } }),
  ]);

  return paginatedResponse(
    bookmarks.map((b) => formatPost(b.post, currentUserId)),
    total,
    page,
    limit
  );
}

/**
 * GET /community/me/comments
 * Returns the user's own comments, each with a minimal `post` context object.
 */
export async function getMyCommentsService(req: any) {
  const { page, limit, skip } = getPagination(req.query);
  const currentUserId: string = req.user!.userId;

  const [comments, total] = await Promise.all([
    prisma.communityComment.findMany({
      where: { userId: currentUserId },
      include: {
        user: { select: { id: true, name: true, avatar: true } },
        post: { select: { id: true, title: true } },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.communityComment.count({ where: { userId: currentUserId } }),
  ]);

  return paginatedResponse(
    comments.map((c) => ({
      ...formatComment(c, currentUserId),
      post: { id: c.post.id, title: c.post.title },
    })),
    total,
    page,
    limit
  );
}

// ─── Comments — CRUD ──────────────────────────────────────────────────────────

/**
 * POST /community/posts/:postId/comments
 */
export async function createCommentService(
  postId: string,
  userId: string,
  body: any
): Promise<CommentShape> {
  const content = typeof body.content === "string" ? body.content.trim() : "";
  if (!content) throw new Error("Content is required");
  if (content.length > 2000)
    throw new Error("Comment must be 2,000 characters or fewer");

  const post = await prisma.communityPost.findUnique({ where: { id: postId } });
  if (!post) throw new Error("Post not found");

  const comment = await prisma.communityComment.create({
    data: { postId, userId, content },
    include: { user: { select: { id: true, name: true, avatar: true } } },
  });

  return formatComment(comment, userId);
}

/**
 * PATCH /community/comments/:commentId
 */
export async function updateCommentService(
  commentId: string,
  userId: string,
  body: any
): Promise<CommentShape> {
  const content = typeof body.content === "string" ? body.content.trim() : "";
  if (!content) throw new Error("Content is required");
  if (content.length > 2000)
    throw new Error("Comment must be 2,000 characters or fewer");

  const existing = await prisma.communityComment.findFirst({
    where: { id: commentId, userId },
    include: { user: { select: { id: true, name: true, avatar: true } } },
  });
  if (!existing) throw new Error("Comment not found or not authorised");

  const updated = await prisma.communityComment.update({
    where: { id: commentId },
    data: { content },
    include: { user: { select: { id: true, name: true, avatar: true } } },
  });

  return formatComment(updated, userId);
}

/**
 * DELETE /community/comments/:commentId
 */
export async function deleteCommentService(
  commentId: string,
  userId: string
): Promise<void> {
  const result = await prisma.communityComment.deleteMany({
    where: { id: commentId, userId },
  });
  if (result.count === 0)
    throw new Error("Comment not found or not authorised");
}

// ─── Admin — hard-delete any post or comment ──────────────────────────────────

/**
 * DELETE /admin/community/posts/:postId
 */
export async function adminDeletePostService(postId: string): Promise<void> {
  const result = await prisma.communityPost.deleteMany({
    where: { id: postId },
  });
  if (result.count === 0) throw new Error("Post not found");
}

/**
 * DELETE /admin/community/comments/:commentId
 */
export async function adminDeleteCommentService(
  commentId: string
): Promise<void> {
  const result = await prisma.communityComment.deleteMany({
    where: { id: commentId },
  });
  if (result.count === 0) throw new Error("Comment not found");
}

// ─── Admin — reports ──────────────────────────────────────────────────────────

/**
 * GET /admin/community/reports
 */
export async function getReportsService(req: any) {
  const { page, limit, skip } = getPagination(req.query);

  const [reports, total] = await Promise.all([
    prisma.postReport.findMany({
      include: {
        post: { select: { id: true, title: true } },
        user: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.postReport.count(),
  ]);

  return paginatedResponse(reports, total, page, limit);
}
