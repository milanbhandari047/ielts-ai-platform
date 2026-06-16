// backend/src/teacher/teacher.routes.ts
import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware.js";
import { TeacherController } from "./teacher.controller.js";

const router: Router = Router();
const ctrl = new TeacherController();

// All routes require authentication + TEACHER or ADMIN role
router.use(authenticate);
router.use((req: any, res: any, next: any) => {
  const role = req.user?.role;
  if (role !== "TEACHER" && role !== "ADMIN") {
    return res
      .status(403)
      .json({ success: false, message: "Teacher access required." });
  }
  next();
});

// ── Dashboard ────────────────────────────────────────────────────
router.get("/dashboard", ctrl.getDashboard.bind(ctrl));

// ── Students ─────────────────────────────────────────────────────
router.get("/students", ctrl.getStudents.bind(ctrl));
router.get("/students/:id", ctrl.getStudentDetail.bind(ctrl));

// ── Score overrides ───────────────────────────────────────────────
router.patch("/writing/:id/score", ctrl.overrideWritingScore.bind(ctrl));
router.patch("/speaking/:id/score", ctrl.overrideSpeakingScore.bind(ctrl));

// ── Tests ─────────────────────────────────────────────────────────
router.get("/tests/reading", ctrl.getReadingTests.bind(ctrl));
router.post("/tests/reading", ctrl.createReadingTest.bind(ctrl));
router.patch("/tests/reading/:id", ctrl.updateTestStatus.bind(ctrl));
router.delete("/tests/reading/:id", ctrl.deleteTest.bind(ctrl));

// ── Writing review ────────────────────────────────────────────────
router.get("/writing/submissions", ctrl.getWritingSubmissions.bind(ctrl));

export default router;

// ── Register in your main app.ts / index.ts ───────────────────────
// import teacherRouter from "./teacher/teacher.routes.js";
// app.use("/api/teacher", teacherRouter);
