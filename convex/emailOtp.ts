import { Email } from "@convex-dev/auth/providers/Email";

// Sends 8-digit one-time codes through Resend's HTTP API (server-side only).
// Convex env vars: AUTH_RESEND_KEY, AUTH_EMAIL_FROM (e.g. "Naeleseneh <no-reply@yourdomain.com>").

function randomCode(length: number): string {
  const bytes = new Uint32Array(length);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => String(b % 10)).join("");
}

async function sendCode(email: string, subject: string, intro: string, code: string) {
  const key = process.env.AUTH_RESEND_KEY;
  const from = process.env.AUTH_EMAIL_FROM;
  if (!key || !from) throw new Error("Email provider is not configured");
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from,
      to: [email],
      subject,
      text: `${intro}\n\nYour code: ${code}\n\nThis code expires in 15 minutes. If you did not request it, ignore this email.`,
    }),
  });
  if (!res.ok) throw new Error(`Email send failed (${res.status})`);
}

export const VerifyEmailOTP = Email({
  id: "verify-email-otp",
  maxAge: 60 * 15,
  generateVerificationToken: async () => randomCode(8),
  sendVerificationRequest: async ({ identifier, token }) =>
    sendCode(
      identifier,
      "Verify your email - Naeleseneh Properties",
      "Use this code to verify your email address.",
      token
    ),
});

export const ResetPasswordOTP = Email({
  id: "reset-password-otp",
  maxAge: 60 * 15,
  generateVerificationToken: async () => randomCode(8),
  sendVerificationRequest: async ({ identifier, token }) =>
    sendCode(
      identifier,
      "Reset your password - Naeleseneh Properties",
      "Use this code to reset your password.",
      token
    ),
});
