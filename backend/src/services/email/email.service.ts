import { transporter } from "./mailer.config.js";
import { emailVerifiedTemplate } from "./templates/email-verified.template.js";
import {
  verificationEmailTemplate,
  passwordResetEmailTemplate,
  passwordChangedEmailTemplate,
} from "./templates/index.js";

export class EmailService {
  private async send(to: string, subject: string, html: string) {
    await transporter.sendMail({
      from: `"IELTS Platform" <${process.env.EMAIL_FROM}>`,
      to,
      subject,
      html,
    });
  }

  async sendVerificationEmail(email: string, name: string, token: string) {
    const verifyUrl = `${process.env.CLIENT_URL}/verify-email?token=${token}`;
    const html = verificationEmailTemplate(name, verifyUrl);

    await this.send(email, "Verify your email — IELTS Platform", html);
  }

  async sendPasswordResetEmail(email: string, name: string, token: string) {
    const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${token}`;
    const html = passwordResetEmailTemplate(name, resetUrl);

    await this.send(email, "Reset your password — IELTS Platform", html);
  }

  async sendPasswordChangedEmail(email: string, name: string) {
    const html = passwordChangedEmailTemplate(name);

    await this.send(email, "Your password was changed — IELTS Platform", html);
  }

  async sendEmailVerifiedEmail(email: string, name: string) {
    const html = emailVerifiedTemplate(name);
    await this.send(email, "Email verified — IELTS Platform", html);
  }
}
