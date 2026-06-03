// ─── Password Reset Email ─────────────────────────────────────────────────────
import { baseTemplate } from "./base.template.js";

export const passwordResetEmailTemplate = (name: string, url: string) =>
  baseTemplate(`
    <p>Hi <strong>${name}</strong>,</p>
    <p>We received a request to reset your password. Click the button below to choose a new one.</p>
    <a href="${url}" class="btn">Reset Password</a>
    <p>Or paste this link into your browser:</p>
    <p style="word-break:break-all;font-size:13px;color:#6b7280">${url}</p>
    <p class="note">This link expires in <strong>1 hour</strong>. If you didn't request a password reset, please ignore this email — your password won't change.</p>
  `);
