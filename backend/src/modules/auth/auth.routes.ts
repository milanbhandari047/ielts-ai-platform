import { Router } from "express";
import { AuthController } from "./auth.controller.js";
import {
  validateRegister,
  validateLogin,
  validateForgotPassword,
  validateResetPassword,
  validateChangePassword,
} from "./auth.validation.js";
import { authenticate } from "../../middleware/auth.middleware.js";

const router: Router = Router();
const authController = new AuthController();

// Public
router.post("/register", validateRegister, (req, res) =>
  authController.register(req, res)
);

router.post("/login", validateLogin, (req, res) =>
  authController.login(req, res)
);

router.post("/refresh", (req, res) => authController.refresh(req, res));

router.post("/logout", (req, res) => authController.logout(req, res));

router.get("/verify-email", (req, res) => authController.verifyEmail(req, res));

router.post("/forgot-password", validateForgotPassword, (req, res) =>
  authController.forgotPassword(req, res)
);

router.post("/reset-password", validateResetPassword, (req, res) =>
  authController.resetPassword(req, res)
);

// OAuth
router.get("/oauth/google", (req, res) =>
  authController.googleOAuthRedirect(req, res)
);

router.get("/oauth/google/callback", (req, res) =>
  authController.googleOAuthCallback(req, res)
);

// Protected
router.get("/me", authenticate, (req, res) => authController.getMe(req, res));

router.post("/resend-verification", authenticate, (req, res) =>
  authController.resendVerification(req, res)
);

router.post(
  "/change-password",
  authenticate,
  validateChangePassword,
  (req, res) => authController.changePassword(req, res)
);

router.post("/logout-all", authenticate, (req, res) =>
  authController.logoutAll(req, res)
);

export default router;
