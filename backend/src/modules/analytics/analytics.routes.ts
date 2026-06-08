import { Router } from "express";
import { AnalyticsController } from "./analytics.controller.js";
import { authenticate } from "../../middleware/auth.middleware.js";

const router: Router = Router();
const ctrl = new AnalyticsController();

router.use(authenticate);
router.get("/dashboard", (req, res) => ctrl.getDashboard(req, res));
router.post("/goal", (req, res) => ctrl.setGoal(req, res));

export default router;
