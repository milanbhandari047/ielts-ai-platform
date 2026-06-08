import { Router } from "express";
import { AiTutorController } from "./ai-tutor.controller.js";
import { authenticate } from "../../middleware/auth.middleware.js";
import { aiLimiter } from "../../middleware/rateLimit.middleware.js";

const router:Router = Router();
const ctrl = new AiTutorController();

router.use(authenticate);
router.post("/sessions", aiLimiter, (req, res) => ctrl.createSession(req, res));
router.get("/sessions", (req, res) => ctrl.getSessions(req, res));
router.get("/sessions/:sessionId", (req, res) => ctrl.getSession(req, res));
router.post("/sessions/:sessionId/message", aiLimiter, (req, res) =>
  ctrl.sendMessage(req, res)
);
router.post("/sessions/:sessionId/stream", aiLimiter, (req, res) =>
  ctrl.streamMessage(req, res)
);
router.delete("/sessions/:sessionId", (req, res) =>
  ctrl.deleteSession(req, res)
);

export default router;
