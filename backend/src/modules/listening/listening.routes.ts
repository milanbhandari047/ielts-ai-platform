import { Router } from "express";
import { ListeningController } from "./listening.controller.js";
import { authenticate } from "../../middleware/auth.middleware.js";

const router: Router = Router();
const ctrl = new ListeningController();

router.use(authenticate);
router.get("/tests", (req, res) => ctrl.getTests(req, res));
router.get("/tests/:testId", (req, res) => ctrl.getTest(req, res));
router.post("/submit", (req, res) => ctrl.submit(req, res));

export default router;
