import type { Request, Response } from "express";
import {
  getPostsService,
  searchPostsService,
  getPostService,
  createPostService,
  updatePostService,
  deletePostService,
  pinPostService,
  likePostService,
  unlikePostService,
  bookmarkPostService,
  unbookmarkPostService,
  reportPostService,
  getMyPostsService,
  getMyBookmarksService,
  getMyCommentsService,
  createCommentService,
  updateCommentService,
  deleteCommentService,
  adminDeletePostService,
  adminDeleteCommentService,
  getReportsService,
} from "./community.service.js";

function success(res: Response, data: any, status = 200): Response {
  return res.status(status).json({
    success: true,
    data,
  });
}

function error(res: Response, err: any): Response {
  const message = err?.message || "Internal server error";

  let status = 500;

  if (message.includes("not found") || message.includes("Not found")) {
    status = 404;
  } else if (
    message.includes("authorised") ||
    message.includes("authorized") ||
    message.includes("forbidden")
  ) {
    status = 403;
  } else if (message.includes("already")) {
    status = 409;
  } else {
    status = 400;
  }

  return res.status(status).json({
    success: false,
    message,
  });
}

export class CommunityController {
  // ─────────────────────────────────────────────
  // Posts
  // ─────────────────────────────────────────────

  async getPosts(req: Request, res: Response) {
    try {
      const data = await getPostsService(req);
      return success(res, data);
    } catch (err) {
      return error(res, err);
    }
  }

  async searchPosts(req: Request, res: Response) {
    try {
      const data = await searchPostsService(req);
      return success(res, data);
    } catch (err) {
      return error(res, err);
    }
  }

  async getPost(req: Request, res: Response) {
    try {
      const data = await getPostService(
        String(req.params.postId),
        req.user!.userId
      );

      return success(res, data);
    } catch (err) {
      return error(res, err);
    }
  }

  async createPost(req: Request, res: Response) {
    try {
      const data = await createPostService(req.user!.userId, req.body);

      return success(res, data, 201);
    } catch (err) {
      return error(res, err);
    }
  }

  async updatePost(req: Request, res: Response) {
    try {
      const data = await updatePostService(
        String(req.params.postId),
        req.user!.userId,
        req.body
      );

      return success(res, data);
    } catch (err) {
      return error(res, err);
    }
  }

  async deletePost(req: Request, res: Response) {
    try {
      await deletePostService(String(req.params.postId), req.user!.userId);

      return success(res, {
        deleted: true,
      });
    } catch (err) {
      return error(res, err);
    }
  }

  async pinPost(req: Request, res: Response) {
    try {
      const data = await pinPostService(String(req.params.postId), true);

      return success(res, data);
    } catch (err) {
      return error(res, err);
    }
  }

  async unpinPost(req: Request, res: Response) {
    try {
      const data = await pinPostService(String(req.params.postId), false);

      return success(res, data);
    } catch (err) {
      return error(res, err);
    }
  }

  // ─────────────────────────────────────────────
  // Likes
  // ─────────────────────────────────────────────

  async likePost(req: Request, res: Response) {
    try {
      const data = await likePostService(
        String(req.params.postId),
        req.user!.userId
      );

      return success(res, data);
    } catch (err) {
      return error(res, err);
    }
  }

  async unlikePost(req: Request, res: Response) {
    try {
      const data = await unlikePostService(
        String(req.params.postId),
        req.user!.userId
      );

      return success(res, data);
    } catch (err) {
      return error(res, err);
    }
  }

  // ─────────────────────────────────────────────
  // Bookmarks
  // ─────────────────────────────────────────────

  async bookmarkPost(req: Request, res: Response) {
    try {
      const data = await bookmarkPostService(
        String(req.params.postId),
        req.user!.userId
      );

      return success(res, data);
    } catch (err) {
      return error(res, err);
    }
  }

  async unbookmarkPost(req: Request, res: Response) {
    try {
      const data = await unbookmarkPostService(
        String(req.params.postId),
        req.user!.userId
      );

      return success(res, data);
    } catch (err) {
      return error(res, err);
    }
  }

  // ─────────────────────────────────────────────
  // Reports
  // ─────────────────────────────────────────────

  async reportPost(req: Request, res: Response) {
    try {
      const data = await reportPostService(
        String(req.params.postId),
        req.user!.userId,
        req.body.reason
      );

      return success(res, data);
    } catch (err) {
      return error(res, err);
    }
  }

  // ─────────────────────────────────────────────
  // My Activity
  // ─────────────────────────────────────────────

  async getMyPosts(req: Request, res: Response) {
    try {
      const data = await getMyPostsService(req);
      return success(res, data);
    } catch (err) {
      return error(res, err);
    }
  }

  async getMyBookmarks(req: Request, res: Response) {
    try {
      const data = await getMyBookmarksService(req);
      return success(res, data);
    } catch (err) {
      return error(res, err);
    }
  }

  async getMyComments(req: Request, res: Response) {
    try {
      const data = await getMyCommentsService(req);
      return success(res, data);
    } catch (err) {
      return error(res, err);
    }
  }

  // ─────────────────────────────────────────────
  // Comments
  // ─────────────────────────────────────────────

  async createComment(req: Request, res: Response) {
    try {
      const data = await createCommentService(
        String(req.params.postId),
        req.user!.userId,
        req.body
      );

      return success(res, data, 201);
    } catch (err) {
      return error(res, err);
    }
  }

  async updateComment(req: Request, res: Response) {
    try {
      const data = await updateCommentService(
        String(req.params.commentId),
        req.user!.userId,
        req.body
      );

      return success(res, data);
    } catch (err) {
      return error(res, err);
    }
  }

  async deleteComment(req: Request, res: Response) {
    try {
      await deleteCommentService(
        String(req.params.commentId),
        req.user!.userId
      );

      return success(res, {
        deleted: true,
      });
    } catch (err) {
      return error(res, err);
    }
  }

  // ─────────────────────────────────────────────
  // Admin
  // ─────────────────────────────────────────────

  async adminDeletePost(req: Request, res: Response) {
    try {
      await adminDeletePostService(String(req.params.postId));

      return success(res, {
        deleted: true,
      });
    } catch (err) {
      return error(res, err);
    }
  }

  async adminDeleteComment(req: Request, res: Response) {
    try {
      await adminDeleteCommentService(String(req.params.commentId));

      return success(res, {
        deleted: true,
      });
    } catch (err) {
      return error(res, err);
    }
  }

  async getReports(req: Request, res: Response) {
    try {
      const data = await getReportsService(req);
      return success(res, data);
    } catch (err) {
      return error(res, err);
    }
  }
}

export const communityController = new CommunityController();
