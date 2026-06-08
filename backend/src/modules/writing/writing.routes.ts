import { Router } from "express";
import { WritingController } from "./writing.controller.js";
import { authenticate } from "../../middleware/auth.middleware.js";

const router: Router = Router();
const ctrl = new WritingController();

router.use(authenticate);
router.get("/prompts", (req, res) => ctrl.getPrompts(req, res));
router.get("/prompts/:promptId", (req, res) => ctrl.getPrompt(req, res));
router.post("/submit", (req, res) => ctrl.submit(req, res));
router.get("/submissions", (req, res) => ctrl.getMySubmissions(req, res));
router.get("/submissions/:submissionId", (req, res) =>
  ctrl.getSubmission(req, res)
);

export default router;
