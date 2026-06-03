// ─── Verification Email ───────────────────────────────────────────────────────
import { baseTemplate } from "./base.template.js";

export const verificationEmailTemplate = (name: string, url: string) =>
  baseTemplate(`
    <p>Hi <strong>${name}</strong>,</p>
    <p>Thanks for signing up! Please verify your email address to activate your account.</p>
    <a href="${url}" class="btn">Verify Email</a>
    <p>Or paste this link into your browser:</p>
    <p style="word-break:break-all;font-size:13px;color:#6b7280">${url}</p>
    <p class="note">This link expires in <strong>24 hours</strong>. If you didn't create an account, you can safely ignore this email.</p>
  `);
