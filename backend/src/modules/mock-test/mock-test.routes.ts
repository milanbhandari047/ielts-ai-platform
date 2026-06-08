import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware.js";
import { MockTestController } from "./mock-test.controller.js";

const router: Router = Router();
const controller = new MockTestController();

router.use(authenticate);

router.get("/tests", controller.getTests.bind(controller));
router.post("/sessions", controller.startSession.bind(controller));
router.get("/sessions", controller.getMySessions.bind(controller));
router.get("/sessions/:sessionId", controller.getSession.bind(controller));
router.post(
  "/sessions/:sessionId/submit-section",
  controller.submitSection.bind(controller)
);
router.post(
  "/sessions/:sessionId/complete",
  controller.completeSession.bind(controller)
);
router.get(
  "/sessions/:sessionId/result",
  controller.getResult.bind(controller)
);

export default router;
