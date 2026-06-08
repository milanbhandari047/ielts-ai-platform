import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { UsersController } from "./users.controller.js";
import { authenticate } from "../../middleware/auth.middleware.js";

const router: Router = Router();
const ctrl = new UsersController();

const avatarDir = path.join(process.cwd(), "uploads", "avatars");
fs.mkdirSync(avatarDir, { recursive: true });

const avatarUpload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, avatarDir),
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname);
      cb(null, `avatar-${Date.now()}${ext}`);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Only image files are allowed"));
  },
});

router.use(authenticate);
router.get("/me", (req, res) => ctrl.getProfile(req, res));
router.patch("/me", (req, res) => ctrl.updateProfile(req, res));
router.post("/me/avatar", avatarUpload.single("avatar"), (req, res) =>
  ctrl.updateAvatar(req, res)
);
router.delete("/me", (req, res) => ctrl.deleteAccount(req, res));

export default router;
