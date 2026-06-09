import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware.js";
import { VocabularyController } from "./vocabulary.controller.js";

const router: Router = Router();
const ctrl = new VocabularyController();

router.use(authenticate);

// ── Vocabulary ─────────────────────────────
router.get("/daily", ctrl.getDailyWords.bind(ctrl));
router.get("/words", ctrl.getAllWords.bind(ctrl));

// ── Saved words ────────────────────────────
router.get("/saved", ctrl.getSaved.bind(ctrl));
router.post("/saved", ctrl.saveWord.bind(ctrl));
router.delete("/saved/:vocabularyId", ctrl.unsaveWord.bind(ctrl));

// ── Quiz ───────────────────────────────────
router.get("/quiz", ctrl.getQuiz.bind(ctrl));
router.post("/quiz/submit", ctrl.submitQuiz.bind(ctrl));

// ── Review / Progress ──────────────────────
router.post("/review", ctrl.submitReview.bind(ctrl));

// ── Stats ──────────────────────────────────
router.get("/stats", ctrl.getStats.bind(ctrl));

router.get("/mastered", ctrl.getMastered.bind(ctrl));
router.get("/reviews", ctrl.getDueReviews.bind(ctrl));

export default router;
