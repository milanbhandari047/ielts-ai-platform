import { Router } from "express";
import {
  authenticate,
  authorize,
  requireEmailVerified,
} from "../../middleware/auth.middleware.js";

import { CommunityController } from "./community.controller.js";

const communityRouter: Router = Router();
const controller = new CommunityController();

// All community routes require authentication
communityRouter.use(authenticate);

// ─────────────────────────────────────────────
// Posts
// ─────────────────────────────────────────────

communityRouter.get("/posts/search", controller.searchPosts.bind(controller));

communityRouter.get("/posts", controller.getPosts.bind(controller));

communityRouter.get("/posts/:postId", controller.getPost.bind(controller));

communityRouter.post(
  "/posts",
  requireEmailVerified,
  controller.createPost.bind(controller)
);

communityRouter.patch(
  "/posts/:postId",
  requireEmailVerified,
  controller.updatePost.bind(controller)
);

communityRouter.delete(
  "/posts/:postId",
  controller.deletePost.bind(controller)
);

// ─────────────────────────────────────────────
// Pin / Unpin (Admin)
// ─────────────────────────────────────────────

communityRouter.patch(
  "/posts/:postId/pin",
  authorize("ADMIN"),
  controller.pinPost.bind(controller)
);

communityRouter.patch(
  "/posts/:postId/unpin",
  authorize("ADMIN"),
  controller.unpinPost.bind(controller)
);

// ─────────────────────────────────────────────
// Likes
// ─────────────────────────────────────────────

communityRouter.post(
  "/posts/:postId/like",
  controller.likePost.bind(controller)
);

communityRouter.delete(
  "/posts/:postId/like",
  controller.unlikePost.bind(controller)
);

// ─────────────────────────────────────────────
// Bookmarks
// ─────────────────────────────────────────────

communityRouter.post(
  "/posts/:postId/bookmark",
  controller.bookmarkPost.bind(controller)
);

communityRouter.delete(
  "/posts/:postId/bookmark",
  controller.unbookmarkPost.bind(controller)
);

// ─────────────────────────────────────────────
// Reports
// ─────────────────────────────────────────────

communityRouter.post(
  "/posts/:postId/report",
  controller.reportPost.bind(controller)
);

// ─────────────────────────────────────────────
// My Activity
// ─────────────────────────────────────────────

communityRouter.get("/me/posts", controller.getMyPosts.bind(controller));

communityRouter.get(
  "/me/bookmarks",
  controller.getMyBookmarks.bind(controller)
);

communityRouter.get("/me/comments", controller.getMyComments.bind(controller));

// ─────────────────────────────────────────────
// Comments
// ─────────────────────────────────────────────

communityRouter.post(
  "/posts/:postId/comments",
  requireEmailVerified,
  controller.createComment.bind(controller)
);

communityRouter.patch(
  "/posts/:postId/comments/:commentId",
  requireEmailVerified,
  controller.updateComment.bind(controller)
);

communityRouter.delete(
  "/posts/:postId/comments/:commentId",
  controller.deleteComment.bind(controller)
);

// ─────────────────────────────────────────────
// Admin Moderation
// ─────────────────────────────────────────────

communityRouter.delete(
  "/admin/posts/:postId",
  authorize("ADMIN"),
  controller.adminDeletePost.bind(controller)
);

communityRouter.delete(
  "/admin/comments/:commentId",
  authorize("ADMIN"),
  controller.adminDeleteComment.bind(controller)
);

communityRouter.get(
  "/admin/reports",
  authorize("ADMIN"),
  controller.getReports.bind(controller)
);

export default communityRouter;
