import type { Request, Response, NextFunction } from "express";

// ─── Register ─────────────────────────────────────────────────────────────────

export const validateRegister = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, email, password, targetBand } = req.body;

  if (!name || name.trim().length < 2) {
    return res
      .status(400)
      .json({ success: false, message: "Name must be at least 2 characters" });
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid email address" });
  }

  if (!password || password.length < 8) {
    return res.status(400).json({
      success: false,
      message: "Password must be at least 8 characters",
    });
  }

  if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
    return res.status(400).json({
      success: false,
      message:
        "Password must contain at least one uppercase letter, one lowercase letter, and one number",
    });
  }

  if (
    targetBand !== undefined &&
    (targetBand < 1 || targetBand > 9 || targetBand % 0.5 !== 0)
  ) {
    return res.status(400).json({
      success: false,
      message: "Target band must be between 1.0 and 9.0 in 0.5 increments",
    });
  }

  next();
};

// ─── Login ────────────────────────────────────────────────────────────────────

export const validateLogin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Email and password are required" });
  }

  next();
};

// ─── Forgot Password ──────────────────────────────────────────────────────────

export const validateForgotPassword = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email } = req.body;

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res
      .status(400)
      .json({ success: false, message: "Valid email is required" });
  }

  next();
};

// ─── Reset Password ───────────────────────────────────────────────────────────

export const validateResetPassword = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { token, newPassword } = req.body;

  if (!token || typeof token !== "string") {
    return res
      .status(400)
      .json({ success: false, message: "Reset token is required" });
  }

  if (!newPassword || newPassword.length < 8) {
    return res.status(400).json({
      success: false,
      message: "New password must be at least 8 characters",
    });
  }

  if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(newPassword)) {
    return res.status(400).json({
      success: false,
      message:
        "Password must contain at least one uppercase letter, one lowercase letter, and one number",
    });
  }

  next();
};

// ─── Change Password ──────────────────────────────────────────────────────────

export const validateChangePassword = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword) {
    return res
      .status(400)
      .json({ success: false, message: "Current password is required" });
  }

  if (!newPassword || newPassword.length < 8) {
    return res.status(400).json({
      success: false,
      message: "New password must be at least 8 characters",
    });
  }

  if (currentPassword === newPassword) {
    return res.status(400).json({
      success: false,
      message: "New password must differ from current password",
    });
  }

  next();
};
