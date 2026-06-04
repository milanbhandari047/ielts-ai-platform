// ─── Password Changed Email ───────────────────────────────────────────────────
import { baseTemplate } from "./base.template.js";
export const passwordChangedEmailTemplate = (name: string) =>
  baseTemplate(`
    <p>Hi <strong>${name}</strong>,</p>
    <p>Your password was changed successfully.</p>
    <p>If you made this change, no action is needed.</p>
    <p>If you did <strong>not</strong> make this change, please <a href="${process.env.CLIENT_URL}/forgot-password" style="color:#4f46e5">reset your password immediately</a> or contact support.</p>
  `);
