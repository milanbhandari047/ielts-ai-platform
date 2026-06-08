import { Router } from "express";
import { ReadingController } from "./reading.controller.js";
import { authenticate } from "../../middleware/auth.middleware.js";

const router: Router = Router();
const ctrl = new ReadingController();

router.use(authenticate);
router.get("/tests", (req, res) => ctrl.getTests(req, res));
router.get("/tests/:testId", (req, res) => ctrl.getTest(req, res));
router.post("/submit", (req, res) => ctrl.submit(req, res));
router.get("/attempts/:attemptId", (req, res) => ctrl.getAttempt(req, res));

export default router;
