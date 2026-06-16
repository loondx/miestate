import nodemailer from "nodemailer";

/**
 * Sends mail via SMTP if configured. If SMTP env vars are missing (local dev),
 * it logs to the console and returns gracefully instead of throwing — so the
 * contact form never fails just because email isn't set up yet.
 */

export function isEmailConfigured(): boolean {
  return Boolean(
    process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS
  );
}

export async function sendMail(opts: {
  subject: string;
  text: string;
  html?: string;
  replyTo?: string;
}): Promise<{ sent: boolean }> {
  const to = process.env.CONTACT_EMAIL || process.env.SMTP_USER;
  if (!isEmailConfigured() || !to) {
    console.info("[email] SMTP not configured — would have sent:", opts.subject);
    return { sent: false };
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });

  await transporter.sendMail({
    from: `"miestate" <${process.env.SMTP_USER}>`,
    to,
    replyTo: opts.replyTo,
    subject: opts.subject,
    text: opts.text,
    html: opts.html,
  });
  return { sent: true };
}
