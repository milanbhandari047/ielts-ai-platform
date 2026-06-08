import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware.js";
import { NotificationController } from "./notifications.controller.js";

const notificationsRouter: Router = Router();

const controller = new NotificationController();

notificationsRouter.use(authenticate);

notificationsRouter.get("/", controller.getNotifications.bind(controller));

notificationsRouter.get(
  "/unread-count",
  controller.getUnreadCount.bind(controller)
);

notificationsRouter.patch("/:id/read", controller.markAsRead.bind(controller));

notificationsRouter.patch(
  "/read-all",
  controller.markAllAsRead.bind(controller)
);

export default notificationsRouter;
