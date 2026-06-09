import api from "@/lib/axios";

// =========================
// Types
// =========================

export interface PostAuthor {
  id: string;
  name: string;
  avatar: string | null;
  role: "STUDENT" | "TEACHER" | "ADMIN";
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  author: PostAuthor;
  isOwn: boolean;
  isLiked?: boolean;
  likeCount?: number;
  post?: {
    id: string;
    title: string;
  };
}

export interface Post {
  id: string;
  userId: string;
  title: string;
  content: string;
  status?: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  isPinned?: boolean;
  createdAt: string;
  updatedAt: string;
  author: PostAuthor;
  isOwn: boolean;
  comments?: Comment[];
  _count?: {
    comments: number;
    likes: number;
    bookmarks: number;
  };
  isLiked?: boolean;
  isBookmarked?: boolean;
  isReported?: boolean;
  commentCount?: number;
  likeCount?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface GetPostsParams {
  page?: number;
  limit?: number;
  sort?: "newest" | "oldest" | "popular";
}

export interface SearchPostsParams {
  q: string;
  page?: number;
  limit?: number;
}

export interface CreatePostPayload {
  title: string;
  content: string;
  status?: "DRAFT" | "PUBLISHED";
}

export interface UpdatePostPayload {
  title?: string;
  content?: string;
  status?: "DRAFT" | "PUBLISHED" | "ARCHIVED";
}

export interface CreateCommentPayload {
  content: string;
  parentId?: string;
}

export interface UpdateCommentPayload {
  content: string;
}

// export interface Report {
//   id: string;
//   postId: string;
//   userId: string;
//   reason: string;
//   createdAt: string;
//   post?: Pick<Post, "id" | "title">;
//   reporter?: PostAuthor;
// }

export interface Report {
  id: string;
  postId: string;
  userId: string;
  reason: string;
  createdAt: string;
  user?: {
    id: string;
    name: string;
    avatar?: string;
  };
  post?: {
    id: string;
    title: string;
    content?: string;
    author?: {
      id: string;
      name: string;
      avatar?: string;
    };
  };
}
// =========================
// Community Service
// =========================

export class CommunityService {
  // Posts

  static async getPosts(
    params: GetPostsParams = {}
  ): Promise<PaginatedResponse<Post>> {
    const { page = 1, limit = 15, sort = "newest" } = params;

    const { data } = await api.get("/community/posts", {
      params: { page, limit, sort },
    });

    return data.data;
  }

  static async searchPosts(
    params: SearchPostsParams
  ): Promise<PaginatedResponse<Post>> {
    const { q, page = 1, limit = 15 } = params;

    const { data } = await api.get("/community/posts/search", {
      params: { q, page, limit },
    });

    return data.data;
  }

  static async getPost(postId: string): Promise<Post> {
    const { data } = await api.get(`/community/posts/${postId}`);
    return data.data;
  }

  static async createPost(payload: CreatePostPayload): Promise<Post> {
    const { data } = await api.post("/community/posts", payload);
    return data.data;
  }

  static async updatePost(
    postId: string,
    payload: UpdatePostPayload
  ): Promise<Post> {
    const { data } = await api.patch(`/community/posts/${postId}`, payload);
    return data.data;
  }

  static async deletePost(postId: string): Promise<{ deleted: boolean }> {
    const { data } = await api.delete(`/community/posts/${postId}`);
    return data.data;
  }

  // Pin / Unpin

  static async pinPost(postId: string): Promise<Post> {
    const { data } = await api.patch(`/community/posts/${postId}/pin`);
    return data.data;
  }

  static async unpinPost(postId: string): Promise<Post> {
    const { data } = await api.patch(`/community/posts/${postId}/unpin`);
    return data.data;
  }

  // Likes

  static async likePost(
    postId: string
  ): Promise<{ liked: boolean; likeCount: number }> {
    const { data } = await api.post(`/community/posts/${postId}/like`);
    return data.data;
  }

  static async unlikePost(
    postId: string
  ): Promise<{ liked: boolean; likeCount: number }> {
    const { data } = await api.delete(`/community/posts/${postId}/like`);
    return data.data;
  }

  // Bookmarks

  static async bookmarkPost(postId: string): Promise<{ bookmarked: boolean }> {
    const { data } = await api.post(`/community/posts/${postId}/bookmark`);
    return data.data;
  }

  static async unbookmarkPost(
    postId: string
  ): Promise<{ bookmarked: boolean }> {
    const { data } = await api.delete(`/community/posts/${postId}/bookmark`);
    return data.data;
  }

  // Reports

  static async reportPost(
    postId: string,
    reason: string
  ): Promise<{ reported: boolean }> {
    const { data } = await api.post(`/community/posts/${postId}/report`, {
      reason,
    });

    return data.data;
  }

  // My Activity

  static async getMyPosts(
    params: GetPostsParams = {}
  ): Promise<PaginatedResponse<Post>> {
    const { page = 1, limit = 10 } = params;

    const { data } = await api.get("/community/me/posts", {
      params: { page, limit },
    });

    return data.data;
  }

  static async getMyBookmarks(
    params: GetPostsParams = {}
  ): Promise<PaginatedResponse<Post>> {
    const { page = 1, limit = 10 } = params;

    const { data } = await api.get("/community/me/bookmarks", {
      params: { page, limit },
    });

    return data.data;
  }

  static async getMyComments(
    params: GetPostsParams = {}
  ): Promise<PaginatedResponse<Comment>> {
    const { page = 1, limit = 10 } = params;

    const { data } = await api.get("/community/me/comments", {
      params: { page, limit },
    });

    return data.data;
  }

  // Comments

  static async createComment(
    postId: string,
    payload: CreateCommentPayload
  ): Promise<Comment> {
    const { data } = await api.post(
      `/community/posts/${postId}/comments`,
      payload
    );

    return data.data;
  }

  static async updateComment(
    postId: string,
    commentId: string,
    payload: UpdateCommentPayload
  ): Promise<Comment> {
    const { data } = await api.patch(
      `/community/posts/${postId}/comments/${commentId}`,
      payload
    );

    return data.data;
  }

  static async deleteComment(
    postId: string,
    commentId: string
  ): Promise<{ deleted: boolean }> {
    const { data } = await api.delete(
      `/community/posts/${postId}/comments/${commentId}`
    );

    return data.data;
  }

  // Admin

  static async adminDeletePost(postId: string): Promise<{ deleted: boolean }> {
    const { data } = await api.delete(`/community/admin/posts/${postId}`);

    return data.data;
  }

  static async adminDeleteComment(
    commentId: string
  ): Promise<{ deleted: boolean }> {
    const { data } = await api.delete(`/community/admin/comments/${commentId}`);

    return data.data;
  }

  static async getReports(
    params: { page?: number; limit?: number } = {}
  ): Promise<PaginatedResponse<Report>> {
    const { page = 1, limit = 20 } = params;

    const { data } = await api.get("/community/admin/reports", {
      params: { page, limit },
    });

    return data.data;
  }

  async resolveReport(reportId: string) {
    await api.patch(`/community/reports/${reportId}/resolve`);
  }

  async dismissReport(reportId: string) {
    await api.patch(`/community/reports/${reportId}/dismiss`);
  }
}
