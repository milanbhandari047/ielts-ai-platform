import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { SpeakingController } from "./speaking.controller.js";
import { authenticate } from "../../middleware/auth.middleware.js";

const router: Router = Router();
const ctrl = new SpeakingController();

const uploadDir = path.join(process.cwd(), "uploads", "audio");
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const ext = path.extname(file.originalname) || ".webm";
    cb(null, `${unique}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = [
      "audio/webm",
      "audio/mp4",
      "audio/wav",
      "audio/mpeg",
      "audio/ogg",
    ];

    cb(null, allowed.includes(file.mimetype));
  },
});

router.use(authenticate);

router.get("/cue-cards", (req, res) => ctrl.getCueCards(req, res));
router.get("/cue-cards/:cueCardId", (req, res) => ctrl.getCueCard(req, res));

router.post("/submit", upload.single("audio"), (req, res) =>
  ctrl.submit(req, res)
);

router.get("/submissions", (req, res) => ctrl.getMySubmissions(req, res));

router.get("/submissions/:submissionId", (req, res) =>
  ctrl.getSubmission(req, res)
);

export default router;
