import { baseTemplate } from "./base.template.js";

export const emailVerifiedTemplate = (name: string) =>
  baseTemplate(`
    <p>Hi <strong>${name}</strong>,</p>
    <p>Your email address has been successfully verified. Welcome to IELTS Platform! 🎉</p>
    <p>You can now access all features of your account.</p>
    <a href="${process.env.CLIENT_URL}/dashboard" class="btn">Go to Dashboard</a>
  `);
